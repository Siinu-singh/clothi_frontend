'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, Truck, CheckCircle, Clock, XCircle, 
  ChevronRight, ChevronDown, MapPin, CreditCard,
  ArrowLeft, Search, Filter
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './Orders.module.css';

const ORDER_STATUSES = {
  pending: { label: 'Pending', icon: Clock, color: '#f59e0b' },
  processing: { label: 'Processing', icon: Package, color: '#3b82f6' },
  shipped: { label: 'Shipped', icon: Truck, color: '#8b5cf6' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: '#10b981' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: '#ef4444' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/orders');
      setOrders(response.data?.orders || response.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await apiFetch(`/orders/${orderId}`, { method: 'DELETE' });
      toast.success('Order cancelled');
      await loadOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return `$${(price || 0).toFixed(2)}`;
  };

  const getStatusInfo = (status) => {
    return ORDER_STATUSES[status] || ORDER_STATUSES.pending;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = !searchQuery || 
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <Link href="/account" className={styles.backLink}>
            <ArrowLeft size={16} />
            Account Settings
          </Link>
          <div className={styles.headerMain}>
            <div>
              <span className={styles.kicker}>Order History</span>
              <h1 className={styles.title}>My Orders</h1>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {Object.entries(ORDER_STATUSES).map(([key, value]) => (
              <button
                key={key}
                className={`${styles.filterTab} ${filter === key ? styles.filterTabActive : ''}`}
                onClick={() => setFilter(key)}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <Package size={64} strokeWidth={1} className={styles.emptyIcon} />
            <h2>No orders found</h2>
            <p>
              {filter !== 'all' 
                ? `You don't have any ${ORDER_STATUSES[filter]?.label.toLowerCase()} orders.`
                : "You haven't placed any orders yet."}
            </p>
            <Link href="/catalog" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} className={styles.orderCard}>
                  <div 
                    className={styles.orderHeader}
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className={styles.orderMeta}>
                      <span className={styles.orderNumber}>
                        Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={styles.orderDate}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className={styles.orderStatus} style={{ color: statusInfo.color }}>
                      <StatusIcon size={16} />
                      <span>{statusInfo.label}</span>
                    </div>
                    <div className={styles.orderTotal}>
                      <span className={styles.totalLabel}>Total</span>
                      <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
                    </div>
                    <button className={styles.expandBtn}>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className={styles.orderDetails}>
                      {/* Order Items */}
                      <div className={styles.orderItems}>
                        <h4>Items ({order.items?.length || 0})</h4>
                        {order.items?.map((item, idx) => (
                          <div key={idx} className={styles.orderItem}>
                            <div className={styles.itemImage}>
                              <img 
                                src={item.product?.image || item.image || '/placeholder.png'} 
                                alt={item.product?.title || item.title} 
                              />
                            </div>
                            <div className={styles.itemInfo}>
                              <Link 
                                href={`/product/${item.productId || item.product?._id}`}
                                className={styles.itemName}
                              >
                                {item.product?.title || item.title || 'Product'}
                              </Link>
                              <div className={styles.itemMeta}>
                                {item.size && <span>Size: {item.size}</span>}
                                {item.color && <span>Color: {item.color}</span>}
                                <span>Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className={styles.itemPrice}>
                              {formatPrice(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className={styles.orderSummary}>
                        <div className={styles.summarySection}>
                          <h4><MapPin size={14} /> Shipping Address</h4>
                          {order.shippingAddress ? (
                            <p>
                              {order.shippingAddress.street}<br />
                              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                              {order.shippingAddress.country}
                            </p>
                          ) : (
                            <p className={styles.textMuted}>No address provided</p>
                          )}
                        </div>

                        <div className={styles.summarySection}>
                          <h4><CreditCard size={14} /> Payment</h4>
                          <p>
                            {order.paymentMethod || 'Card'} ending in ****{order.cardLast4 || '0000'}
                          </p>
                        </div>

                        <div className={styles.summarySection}>
                          <h4>Order Summary</h4>
                          <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal || order.total)}</span>
                          </div>
                          <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className={styles.summaryRow}>
                              <span>Discount</span>
                              <span className={styles.discount}>-{formatPrice(order.discount)}</span>
                            </div>
                          )}
                          <div className={styles.summaryRow}>
                            <span>Tax</span>
                            <span>{formatPrice(order.tax || 0)}</span>
                          </div>
                          <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tracking Info */}
                      {order.trackingNumber && (
                        <div className={styles.trackingInfo}>
                          <Truck size={16} />
                          <span>Tracking: {order.trackingNumber}</span>
                          <a 
                            href={`https://track.example.com/${order.trackingNumber}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.trackLink}
                          >
                            Track Package
                          </a>
                        </div>
                      )}

                      {/* Order Actions */}
                      <div className={styles.orderActions}>
                        {(order.status === 'pending' || order.status === 'processing') && (
                          <button 
                            className={styles.cancelBtn}
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Cancel Order
                          </button>
                        )}
                        <button className={styles.reorderBtn}>
                          Reorder
                        </button>
                        <Link href={`/orders/${order._id}`} className={styles.viewBtn}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
