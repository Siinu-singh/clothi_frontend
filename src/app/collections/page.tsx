import { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Curated Clothing Collections - Premium Sustainable Fashion',
  description: 'Explore CLOTHI\'s exclusive curated fashion collections. Sustainable coastal lifestyle apparel, from premium organic cotton basics to limited edition seasonal styles. Ethical trade & eco-friendly materials.',
  keywords: [
    'clothing collections',
    'curated fashion collections',
    'sustainable apparel collections',
    'coastal clothing styles',
    'organic cotton collections',
    'eco-friendly fashion sets',
    'ethical garments',
  ],
  openGraph: {
    title: 'Curated Clothing Collections | CLOTHI',
    description: 'Explore CLOTHI\'s exclusive curated fashion collections. Sustainable coastal lifestyle apparel, from premium organic cotton basics to limited edition seasonal styles.',
    type: 'website',
    url: 'https://clothi.co.in/collections',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CLOTHI - Curated Clothing Collections',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Clothing Collections | CLOTHI',
    description: 'Explore CLOTHI\'s exclusive curated fashion collections. Sustainable coastal lifestyle apparel, from premium organic cotton basics to limited edition seasonal styles.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/collections',
  },
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-500">Loading collections...</div>
      </div>
    }>
      <CollectionsClient />
    </Suspense>
  );
}
