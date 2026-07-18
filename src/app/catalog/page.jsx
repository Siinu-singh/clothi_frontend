// Catalog page metadata export (this file can have both metadata and client component)
// Note: Next.js allows metadata export in files that also have 'use client' components if properly structured

export const metadata = {
  title: 'Shop Our Collection - Sustainable Fashion',
  description: 'Browse CLOTHI\'s curated collection of sustainable coastal apparel. Premium organic cotton clothing for men and women. Filter by category, size, and style. Free shipping on orders over ₹100.',
  keywords: [
    'sustainable clothing',
    'organic cotton apparel',
    'mens fashion',
    'womens fashion',
    'coastal style',
    'ethical fashion',
    'premium clothing',
    'eco-friendly clothes',
  ],
  openGraph: {
    title: 'Shop Our Collection | CLOTHI',
    description: 'Browse CLOTHI\'s curated collection of sustainable coastal apparel. Premium organic cotton clothing for men and women.',
    type: 'website',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/catalog',
  },
};

import { Suspense } from 'react';
import CatalogClient from './CatalogClient';
import { apiFetch } from '../../lib/api';

export default async function CatalogPage({ searchParams }) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const category = resolvedSearchParams.category || '';
  const sortBy = resolvedSearchParams.sortBy || 'newest';

  let initialResponse = null;
  try {
    let url = `/products?page=1&limit=20&sortBy=${sortBy}`;
    if (category) {
      url += `&category=${category}`;
    }
    initialResponse = await apiFetch(url);
  } catch (error) {
    console.error('Failed to pre-fetch products for catalog page:', error);
  }

  return (
    <Suspense fallback={<div>Loading catalog...</div>}>
      <CatalogClient
        categoryProp={category}
        initialResponse={initialResponse}
        initialSortBy={sortBy}
      />
    </Suspense>
  );
}
