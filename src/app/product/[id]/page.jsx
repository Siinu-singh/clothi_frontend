import ProductDetailClient from './ProductDetailClient';
import { JsonLd, generateProductSchema, generateBreadcrumbSchema } from '../../../components/seo/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = 'https://clothi.com';

// Fetch product data for metadata
async function getProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Failed to fetch product for metadata:', error);
    return null;
  }
}

// Dynamic metadata generation for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      robots: { index: false },
    };
  }

  const title = `${product.title} - ${product.category}`;
  const description = product.description?.slice(0, 155) || 
    `Shop ${product.title} from CLOTHI. Premium sustainable coastal apparel. $${product.price}. Free shipping on orders over $100.`;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category,
      'sustainable fashion',
      'premium clothing',
      'CLOTHI',
      ...((product.colors || []).slice(0, 3)),
    ],
    openGraph: {
      title: `${product.title} | CLOTHI`,
      description,
      type: 'website',
      url: `${SITE_URL}/product/${params.id}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} | CLOTHI`,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `/product/${params.id}`,
    },
  };
}

// Server component wrapper for product page
export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);

  // Generate structured data for SEO
  const productSchema = product ? generateProductSchema(product, SITE_URL) : null;
  const breadcrumbSchema = product ? generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Catalog', url: '/catalog' },
    { name: product.category, url: `/catalog?category=${encodeURIComponent(product.category)}` },
    { name: product.title, url: `/product/${params.id}` },
  ], SITE_URL) : null;

  return (
    <>
      {productSchema && <JsonLd data={productSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <ProductDetailClient params={params} initialProduct={product} />
    </>
  );
}
