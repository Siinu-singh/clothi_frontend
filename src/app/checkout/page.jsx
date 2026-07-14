'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Lock, CreditCard, Truck, MapPin,
  Check, ChevronDown, Plus, Shield
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Checkout.module.css';
import Script from 'next/script';

const SHIPPING_OPTIONS = [
  { id: 'standard', name: 'Standard Shipping', price: 0, days: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 15, days: '2-3 business days' },
  { id: 'overnight', name: 'Overnight Shipping', price: 30, days: '1 business day' },
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [showNewAddress, setShowNewAddress] = useState(false);
  
  // New address form
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: '',
    saveAddress: true,
  });

  // Payment form
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    saveCard: false,
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      router.push('/cart');
      return;
    }
    loadAddresses();
  }, [user, cart]);

  const loadAddresses = async () => {
    try {
      const response = await apiFetch('/addresses');
      // API may return { data: [...] }, { data: { addresses: [...] } }, or just [...]
      const raw = response.data ?? response;
      const addrs = Array.isArray(raw) ? raw : (Array.isArray(raw.addresses) ? raw.addresses : []);
      setAddresses(addrs);
      // Auto-select default address
      const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    }
  };

  const getShippingCost = () => {
    const option = SHIPPING_OPTIONS.find(o => o.id === selectedShipping);
    return option?.price || 0;
  };

  const getSubtotal = () => cart.totalPrice || 0;
  
  const getTax = () => getSubtotal() * 0.08; // 8% tax
  
  const getTotal = () => getSubtotal() + getShippingCost() + getTax();

  const formatPrice = (price) => `₹${(price || 0).toFixed(2)}`;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (addressForm.saveAddress) {
      try {
        const response = await apiFetch('/addresses', {
          method: 'POST',
          body: JSON.stringify({
            label: 'Shipping',
            street: addressForm.street,
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            country: addressForm.country,
          }),
        });
        if (response.data?._id) {
          setAddresses([...addresses, response.data]);
          setSelectedAddress(response.data._id);
        }
      } catch (err) {
        console.error('Failed to save address:', err);
      }
    }
    
    setStep(2);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const shippingAddress = selectedAddress 
        ? addresses.find(a => a._id === selectedAddress)
        : {
            street: addressForm.street,
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            country: addressForm.country,
            firstName: addressForm.firstName,
            lastName: addressForm.lastName,
            email: user?.email || '',
            phone: addressForm.phone,
          };

      // Handle missing names/email/phone on selectedAddress
      if (shippingAddress) {
        if (!shippingAddress.firstName) shippingAddress.firstName = addressForm.firstName || user?.firstName || '';
        if (!shippingAddress.lastName) shippingAddress.lastName = addressForm.lastName || user?.lastName || '';
        if (!shippingAddress.email) shippingAddress.email = user?.email || '';
        if (!shippingAddress.phone) shippingAddress.phone = addressForm.phone || '';
      }

      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product?.price || 0,
        title: item.product?.title || '',
      }));

      if (paymentMethod === 'razorpay') {
        if (!window.Razorpay) {
          const isLoaded = await loadRazorpayScript();
          if (!isLoaded && !window.Razorpay) {
            throw new Error('Failed to load Razorpay SDK. Please check your internet connection or try refreshing the page.');
          }
        }

        const response = await apiFetch('/orders/razorpay/create', {
          method: 'POST',
          body: JSON.stringify({
            items: orderItems,
            shippingAddress,
            shippingMethod: selectedShipping,
            shippingCost: getShippingCost(),
            subtotal: getSubtotal(),
            tax: getTax(),
            total: getTotal(),
            couponCode: cart.couponCode,
          }),
        });

        const { keyId, razorpayOrder, order: localOrder } = response.data;

        const options = {
          key: keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'CLOTHI',
          description: 'E-commerce Purchase',
          order_id: razorpayOrder.id,
          handler: async function (paymentRes) {
            setLoading(true);
            try {
              const verifyResponse = await apiFetch('/orders/razorpay/verify', {
                method: 'POST',
                body: JSON.stringify({
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                  orderId: localOrder._id,
                }),
              });

              if (verifyResponse.success) {
                await clearCart();
                toast.success('Payment verified successfully!');
                router.push(`/orders?success=true&orderId=${localOrder._id}`);
              } else {
                throw new Error(verifyResponse.message || 'Payment verification failed');
              }
            } catch (err) {
              toast.error(err.message || 'Payment verification failed');
              router.push(`/orders?success=false&orderId=${localOrder._id}`);
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
            email: shippingAddress.email,
            contact: shippingAddress.phone || '',
          },
          theme: {
            color: '#111111',
          },
          modal: {
            ondismiss: function () {
              toast.error('Payment cancelled');
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const orderData = {
          items: orderItems,
          shippingAddress,
          shippingMethod: selectedShipping,
          shippingCost: getShippingCost(),
          subtotal: getSubtotal(),
          tax: getTax(),
          total: getTotal(),
          paymentMethod: 'card',
          cardLast4: paymentForm.cardNumber.slice(-4),
        };

        const response = await apiFetch('/orders', {
          method: 'POST',
          body: JSON.stringify(orderData),
        });

        await clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders?success=true&orderId=${response.data?._id || ''}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !cart.items?.length) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <Link href="/cart" className={styles.backLink}>
            <ChevronLeft size={16} />
            Back to Cart
          </Link>
          <div className={styles.logo}>CLOTHI</div>
          <div className={styles.secure}>
            <Lock size={14} />
            Secure Checkout
          </div>
        </header>

        {/* Progress Steps */}
        <div className={styles.progress}>
          {['Shipping', 'Payment', 'Review'].map((label, idx) => (
            <div 
              key={label}
              className={`${styles.progressStep} ${step > idx + 1 ? styles.completed : ''} ${step === idx + 1 ? styles.active : ''}`}
            >
              <div className={styles.stepNumber}>
                {step > idx + 1 ? <Check size={14} /> : idx + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Main Form */}
          <main className={styles.main}>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <MapPin size={20} />
                  Shipping Address
                </h2>

                {addresses.length > 0 && !showNewAddress && (
                  <div className={styles.addressList}>
                    {addresses.map((addr) => (
                      <label 
                        key={addr._id} 
                        className={`${styles.addressOption} ${selectedAddress === addr._id ? styles.selected : ''}`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === addr._id}
                          onChange={() => setSelectedAddress(addr._id)}
                        />
                        <div className={styles.addressContent}>
                          <span className={styles.addressLabel}>{addr.label || 'Address'}</span>
                          <p>
                            {addr.street}<br />
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                        </div>
                        {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                      </label>
                    ))}
                    <button 
                      className={styles.addNewBtn}
                      onClick={() => setShowNewAddress(true)}
                    >
                      <Plus size={16} />
                      Add New Address
                    </button>
                  </div>
                )}

                {(addresses.length === 0 || showNewAddress) && (
                  <form onSubmit={handleAddressSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={addressForm.firstName}
                          onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={addressForm.lastName}
                          onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={addressForm.street}
                        onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                        placeholder="123 Main St"
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        value={addressForm.apartment}
                        onChange={(e) => setAddressForm({...addressForm, apartment: e.target.value})}
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>City</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>State</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>ZIP Code</label>
                        <input
                          type="text"
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={addressForm.saveAddress}
                        onChange={(e) => setAddressForm({...addressForm, saveAddress: e.target.checked})}
                      />
                      <span>Save this address for future orders</span>
                    </label>

                    {showNewAddress && (
                      <button 
                        type="button" 
                        className={styles.cancelBtn}
                        onClick={() => setShowNewAddress(false)}
                      >
                        Cancel
                      </button>
                    )}

                    <button type="submit" className={styles.continueBtn}>
                      Continue to Payment
                    </button>
                  </form>
                )}

                {addresses.length > 0 && !showNewAddress && selectedAddress && (
                  <div className={styles.shippingOptions}>
                    <h3>Shipping Method</h3>
                    {SHIPPING_OPTIONS.map((option) => (
                      <label 
                        key={option.id}
                        className={`${styles.shippingOption} ${selectedShipping === option.id ? styles.selected : ''}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping === option.id}
                          onChange={() => setSelectedShipping(option.id)}
                        />
                        <div className={styles.shippingInfo}>
                          <span className={styles.shippingName}>{option.name}</span>
                          <span className={styles.shippingDays}>{option.days}</span>
                        </div>
                        <span className={styles.shippingPrice}>
                          {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                        </span>
                      </label>
                    ))}
                    
                    <button 
                      className={styles.continueBtn}
                      onClick={() => setStep(2)}
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <CreditCard size={20} />
                  Payment Method
                </h2>

                <div className={styles.paymentMethods}>
                  <label className={`${styles.paymentMethodOption} ${paymentMethod === 'razorpay' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                    />
                    <div className={styles.paymentMethodContent}>
                      <span className={styles.paymentMethodLabel}>Razorpay (UPI, Cards, Netbanking, Wallets)</span>
                      <p className={styles.paymentMethodDesc}>Pay securely with credit/debit card, UPI, netbanking, or wallets.</p>
                    </div>
                  </label>

                  <label className={`${styles.paymentMethodOption} ${paymentMethod === 'card' ? styles.selected : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <div className={styles.paymentMethodContent}>
                      <span className={styles.paymentMethodLabel}>Manual Credit/Debit Card (Testing Only)</span>
                      <p className={styles.paymentMethodDesc}>Simulated order creation without online payment transaction.</p>
                    </div>
                  </label>
                </div>

                <form onSubmit={handlePaymentSubmit} className={styles.form}>
                  {paymentMethod === 'card' && (
                    <>
                      <div className={styles.formGroup}>
                        <label>Card Number</label>
                        <input
                          type="text"
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm({...paymentForm, cardNumber: formatCardNumber(e.target.value)})}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          required={paymentMethod === 'card'}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Name on Card</label>
                        <input
                          type="text"
                          value={paymentForm.cardName}
                          onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value})}
                          placeholder="John Doe"
                          required={paymentMethod === 'card'}
                        />
                      </div>

                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            value={paymentForm.expiry}
                            onChange={(e) => setPaymentForm({...paymentForm, expiry: formatExpiry(e.target.value)})}
                            placeholder="MM/YY"
                            maxLength={5}
                            required={paymentMethod === 'card'}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>CVV</label>
                          <input
                            type="text"
                            value={paymentForm.cvv}
                            onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            placeholder="123"
                            maxLength={4}
                            required={paymentMethod === 'card'}
                          />
                        </div>
                      </div>

                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={paymentForm.saveCard}
                          onChange={(e) => setPaymentForm({...paymentForm, saveCard: e.target.checked})}
                        />
                        <span>Save card for future purchases</span>
                      </label>
                    </>
                  )}

                  {paymentMethod === 'razorpay' && (
                    <div className={styles.razorpayInfo}>
                      <Shield size={24} className={styles.razorpayInfoIcon} />
                      <p>You will complete your payment securely via the Razorpay gateway after reviewing your order in the next step.</p>
                    </div>
                  )}

                  <div className={styles.formActions}>
                    <button type="button" className={styles.backBtn} onClick={() => setStep(1)}>
                      Back
                    </button>
                    <button type="submit" className={styles.continueBtn}>
                      Review Order
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Review Your Order</h2>

                <div className={styles.reviewSection}>
                  <h3>Shipping Address</h3>
                  {selectedAddress ? (
                    <p>
                      {addresses.find(a => a._id === selectedAddress)?.street}<br />
                      {addresses.find(a => a._id === selectedAddress)?.city}, {addresses.find(a => a._id === selectedAddress)?.state} {addresses.find(a => a._id === selectedAddress)?.zipCode}
                    </p>
                  ) : (
                    <p>
                      {addressForm.street}<br />
                      {addressForm.city}, {addressForm.state} {addressForm.zipCode}
                    </p>
                  )}
                  <button className={styles.editBtn} onClick={() => setStep(1)}>Edit</button>
                </div>

                <div className={styles.reviewSection}>
                  <h3>Shipping Method</h3>
                  <p>
                    {SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.name} - {SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.days}
                  </p>
                </div>

                <div className={styles.reviewSection}>
                  <h3>Payment</h3>
                  <p>{paymentMethod === 'razorpay' ? 'Razorpay (Cards, UPI, Netbanking, Wallets)' : `Card ending in ${paymentForm.cardNumber.slice(-4)}`}</p>
                  <button className={styles.editBtn} onClick={() => setStep(2)}>Edit</button>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(2)}>
                    Back
                  </button>
                  <button 
                    className={styles.placeOrderBtn}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Place Order - ${formatPrice(getTotal())}`}
                  </button>
                </div>
              </section>
            )}
          </main>

          {/* Order Summary Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>
              
              <div className={styles.cartItems}>
                {cart.items?.map((item) => (
                  <div key={item._id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.product?.image || '/placeholder.png'} alt={item.product?.title} />
                      <span className={styles.itemQty}>{item.quantity}</span>
                    </div>
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.product?.title}</span>
                      <span className={styles.itemMeta}>{item.size} / {item.color}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryLines}>
                <div className={styles.summaryLine}>
                  <span>Subtotal</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Shipping</span>
                  <span>{getShippingCost() === 0 ? 'FREE' : formatPrice(getShippingCost())}</span>
                </div>
                <div className={styles.summaryLine}>
                  <span>Tax</span>
                  <span>{formatPrice(getTax())}</span>
                </div>
                <div className={`${styles.summaryLine} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <Shield size={16} />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <div className={styles.trustBadge}>
                  <Truck size={16} />
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
