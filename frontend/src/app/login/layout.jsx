export const metadata = {
  title: 'Sign In - CLOTHI Account',
  description: 'Sign in to your CLOTHI account. Access your orders, favorites, and account settings. Enjoy free shipping on orders over $100.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/login',
  },
};

export default function LoginLayout({ children }) {
  return children;
}
