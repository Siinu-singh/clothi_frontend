export const metadata = {
  title: 'My Orders - CLOTHI',
  description: 'Track your CLOTHI orders. View order history, delivery status, and invoices. Need help? Contact our customer service team.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/orders',
  },
};

export default function OrdersLayout({ children }) {
  return children;
}
