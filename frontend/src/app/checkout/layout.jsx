export const metadata = {
  title: 'Secure Checkout - CLOTHI',
  description: 'Complete your purchase securely at CLOTHI. Enter your shipping and payment information. 256-bit SSL encryption. Free 30-day returns.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/checkout',
  },
};

export default function CheckoutLayout({ children }) {
  return children;
}
