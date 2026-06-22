import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { getCollectionBySlug, getCollections } from '@/lib/api-collections';
import CatalogClient from '@/app/catalog/CatalogClient';
import { JsonLd, generateBreadcrumbSchema } from '@/components/seo/JsonLd';

const SITE_URL = 'https://clothi.co.in';

export const revalidate = 3600; // Revalidate collections page hourly

export async function generateStaticParams() {
  try {
    const response = await getCollections(1, 100);
    return (response.data || []).map((collection: any) => ({
      slug: collection.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for collections:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const response = await getCollectionBySlug(resolvedParams.slug);
    let collection = response.data;
    
    if (!collection) {
      const slugLower = resolvedParams.slug.toLowerCase();
      const fallbacks: Record<string, { name: string; description: string }> = {
        'polo': {
          name: 'The Crown Series (Polo)',
          description: 'Explore the Crown Series premium Polo T-Shirts collection at CLOTHI.'
        },
        'oversize': {
          name: 'Zen-G (Oversize)',
          description: 'Explore Zen-G by Clothi oversized T-Shirts collection at CLOTHI.'
        },
        'casual': {
          name: 'Prime Basics (Casual)',
          description: 'Explore Prime Basics casual T-Shirts collection at CLOTHI.'
        },
        'dry-fit': {
          name: 'Motion X (Dry-Fit)',
          description: 'Explore Motion X Dry-Fit performance T-Shirts collection at CLOTHI.'
        },
      };

      if (fallbacks[slugLower]) {
        collection = {
          name: fallbacks[slugLower].name,
          description: fallbacks[slugLower].description,
          slug: resolvedParams.slug,
        } as any;
      } else {
        const formattedName = resolvedParams.slug
          .split('-')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        collection = {
          name: formattedName,
          description: `Explore the ${formattedName} collection at CLOTHI.`,
          slug: resolvedParams.slug,
        } as any;
      }
    }

    const title = `${collection.name} Collection — Curated Fashion`;
    const description = collection.description?.slice(0, 155) || 
      `Browse the ${collection.name} collection at CLOTHI. Premium sustainable coastal fashion. Free shipping on orders over $100.`;
    const mainImage = (collection as any).images?.find((img: any) => img.isMain)?.url || (collection as any).images?.[0]?.url || '/og-image.png';

    return {
      title,
      description,
      keywords: [
        collection.name,
        (collection as any).category || '',
        ...((collection as any).tags || []),
        'sustainable fashion',
        'CLOTHI collection',
      ],
      openGraph: {
        title: `${collection.name} Collection | CLOTHI`,
        description,
        type: 'website',
        url: `${SITE_URL}/collections/${resolvedParams.slug}`,
        images: [
          {
            url: mainImage,
            width: 800,
            height: 800,
            alt: collection.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${collection.name} Collection | CLOTHI`,
        description,
        images: [mainImage],
      },
      alternates: {
        canonical: `/collections/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    console.error('Failed to generate collection metadata:', error);
    return {
      title: 'Collection | CLOTHI',
      description: 'Explore CLOTHI\'s curated fashion collections.',
    };
  }
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  let collection = null;

  try {
    const response = await getCollectionBySlug(resolvedParams.slug);
    collection = response.data;
  } catch (err: any) {
    console.error('Failed to load collection in page component:', err);
  }

  if (!collection) {
    const slugLower = resolvedParams.slug.toLowerCase();
    const fallbacks: Record<string, { name: string; category: string; description: string }> = {
      'polo': {
        name: 'The Crown Series (Polo)',
        category: 'POLO',
        description: 'Explore the Crown Series premium Polo T-Shirts collection at CLOTHI.'
      },
      'oversize': {
        name: 'Zen-G (Oversize)',
        category: 'OVERSIZE',
        description: 'Explore Zen-G by Clothi oversized T-Shirts collection at CLOTHI.'
      },
      'casual': {
        name: 'Prime Basics (Casual)',
        category: 'CASUAL',
        description: 'Explore Prime Basics casual T-Shirts collection at CLOTHI.'
      },
      'dry-fit': {
        name: 'Motion X (Dry-Fit)',
        category: 'DRY-FIT',
        description: 'Explore Motion X Dry-Fit performance T-Shirts collection at CLOTHI.'
      },
    };

    if (fallbacks[slugLower]) {
      collection = {
        name: fallbacks[slugLower].name,
        category: fallbacks[slugLower].category,
        description: fallbacks[slugLower].description,
        slug: resolvedParams.slug,
      };
    } else {
      const formattedName = resolvedParams.slug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      collection = {
        name: formattedName,
        category: resolvedParams.slug.toUpperCase(),
        description: `Explore the ${formattedName} collection at CLOTHI.`,
        slug: resolvedParams.slug,
      };
    }
  }

  // Generate dynamic breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.name, url: `/collections/${resolvedParams.slug}` },
  ], SITE_URL);

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen bg-white">
          <p className="text-gray-500">Loading collection...</p>
        </div>
      }>
        <CatalogClient categoryProp={collection.category} />
      </Suspense>
    </>
  );
}

