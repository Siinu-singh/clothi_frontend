import { Metadata } from 'next';
import SharedWishlistPageClient from './SharedWishlistPageClient';

export const metadata: Metadata = {
  title: 'Shared Wishlist | CLOTHI',
  description: 'Browse a shared wishlist from someone on CLOTHI',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SharedWishlistPage({ params }: { params: { token: string } }) {
  return <SharedWishlistPageClient shareToken={params.token} />;
}
