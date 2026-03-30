export const metadata = {
  title: 'Shopping Cart - CLOTHI',
  description: 'Review your shopping cart. Complete your purchase and enjoy free shipping on orders over $100. Browse our sustainable fashion collection.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/cart',
  },
};

export default function CartLayout({ children }) {
  return children;
}
