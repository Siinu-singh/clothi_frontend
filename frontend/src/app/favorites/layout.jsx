export const metadata = {
  title: 'My Favorites - CLOTHI',
  description: 'View your saved favorite items from CLOTHI. Create your wishlist of sustainable coastal apparel. Sign in to sync favorites across devices.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/favorites',
  },
};

export default function FavoritesLayout({ children }) {
  return children;
}
