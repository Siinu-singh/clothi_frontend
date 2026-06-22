/**
 * SEO utilities for generating metadata and structured data
 */

export interface Product {
  _id: string;
  title: string;
  description?: string;
  price: number;
  oldPrice?: number;
  image?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  badge?: string;
  category?: string;
}

export interface ProductSeoProps {
  product: Product;
  baseUrl: string;
}

/**
 * Generate product metadata for Next.js
 */
export function generateProductMetadata(
  product: Product,
  baseUrl: string,
) {
  const title = `${product.title} | CLOTHI`;
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.title} at CLOTHI. Premium sustainable coastal apparel.`;
  const url = `${baseUrl}/product/${product._id}`;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.category || 'clothing',
      'sustainable fashion',
      'organic cotton',
    ],
    openGraph: {
      title,
      description,
      type: 'product',
      url,
      images: product.image ? [{ url: product.image, width: 800, height: 800 }] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate product structured data (JSON-LD schema)
 */
export function generateProductSchema(product: Product, baseUrl: string) {
  const url = `${baseUrl}/product/${product._id}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || '',
    image: product.images || [product.image],
    url,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: product.price.toString(),
      ...(product.oldPrice && { priceCurrency: 'INR' }),
      availability: 'https://schema.org/InStock',
    },
  };

  // Add rating if available
  if (product.rating && product.reviewCount) {
    (schema as any).aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toFixed(1),
      reviewCount: product.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CLOTHI',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Premium sustainable coastal lifestyle apparel',
    sameAs: [
      'https://twitter.com/clothi',
      'https://instagram.com/clothi',
      'https://facebook.com/clothi',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@clothi.co.in',
      contactType: 'customer service',
    },
  };
}
