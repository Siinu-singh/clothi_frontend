import { Metadata } from 'next';
import Link from 'next/link';
import { getCollectionBySlug, getCollections } from '@/lib/api-collections';
import CollectionDetail from '@/components/public/CollectionDetail';
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
    const collection = response.data;
    
    if (!collection) {
      return {
        title: 'Collection Not Found',
        description: 'The requested collection could not be found.',
        robots: { index: false },
      };
    }

    const title = `${collection.name} Collection — Curated Fashion`;
    const description = collection.description?.slice(0, 155) || 
      `Browse the ${collection.name} collection at CLOTHI. Premium sustainable coastal fashion. Free shipping on orders over $100.`;
    const mainImage = collection.images?.find(img => img.isMain)?.url || collection.images?.[0]?.url || '/og-image.png';

    return {
      title,
      description,
      keywords: [
        collection.name,
        collection.category,
        ...(collection.tags || []),
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
  let errorMsg = null;

  try {
    const response = await getCollectionBySlug(resolvedParams.slug);
    collection = response.data;
  } catch (err: any) {
    console.error('Failed to load collection in page component:', err);
    errorMsg = err.message || 'Failed to load collection';
  }

  if (errorMsg || !collection) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Collection Not Found</h1>
          <p className="text-gray-500 mb-6">
            {errorMsg || 'The collection you are looking for does not exist or has been removed.'}
          </p>
          <Link href="/collections" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to collections
          </Link>
        </div>
      </div>
    );
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
      <CollectionDetail collection={collection} />
    </>
  );
}
