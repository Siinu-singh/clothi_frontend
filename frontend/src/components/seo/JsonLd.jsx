/**
 * JSON-LD Structured Data Component
 * Renders schema.org structured data for SEO
 */
export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // XSS protection: escape < characters
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

/**
 * Product Schema Generator
 */
export function generateProductSchema(product, baseUrl = 'https://clothi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images || [product.image],
    description: product.description,
    sku: product.sku || product._id,
    brand: {
      '@type': 'Brand',
      name: 'CLOTHI',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/product/${product._id}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'CLOTHI',
      },
    },
    category: product.category,
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.average || product.rating,
        reviewCount: product.rating.count || product.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

/**
 * Breadcrumb Schema Generator
 */
export function generateBreadcrumbSchema(items, baseUrl = 'https://clothi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * FAQ Schema Generator
 */
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Article Schema Generator (for blog posts)
 */
export function generateArticleSchema(article, baseUrl = 'https://clothi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'CLOTHI Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CLOTHI',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };
}

/**
 * Local Business Schema (if physical stores exist)
 */
export function generateLocalBusinessSchema(store) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: store.name,
    image: store.image,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.street,
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.zipCode,
      addressCountry: store.country || 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.latitude,
      longitude: store.longitude,
    },
    telephone: store.phone,
    openingHoursSpecification: store.hours?.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day,
      opens: h.opens,
      closes: h.closes,
    })),
    priceRange: '$$',
  };
}
