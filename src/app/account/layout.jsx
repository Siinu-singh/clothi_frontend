export const metadata = {
  title: 'Account Settings - CLOTHI',
  description: 'Manage your CLOTHI account. Update profile, addresses, security settings, and notification preferences. Track your orders and manage saved payment methods.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/account',
  },
};

export default function AccountLayout({ children }) {
  return children;
}
