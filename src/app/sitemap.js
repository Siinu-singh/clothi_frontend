/**
 * Dynamic Sitemap for CLOTHI E-commerce
 * Generates sitemap.xml with all pages, products, and collections
 */

const BASE_URL = 'https://clothi.co.in';
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api`;

// Static pages with their priorities and change frequencies
// (Excludes /login and /register as they are disallowed in robots.txt and noindexed)
const staticPages = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/catalog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/collections', priority: 0.8, changeFrequency: 'daily' },
];

// Fetch products from API for dynamic product pages
async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data?.products || [];
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
    return [];
  }
}

// Fetch collections from API for dynamic collection pages
async function getCollections() {
  try {
    const response = await fetch(`${API_URL}/collections?limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch collections for sitemap:', error);
    return [];
  }
}

export default async function sitemap() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  const currentDate = new Date();

  // Static pages
  const staticRoutes = staticPages.map(page => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: currentDate,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Dynamic product pages
  const productRoutes = products.map(product => ({
    url: `${BASE_URL}/product/${product._id}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
    images: product.images?.length > 0 
      ? product.images 
      : product.image 
        ? [product.image] 
        : [],
  }));

  // Dynamic collection pages
  const collectionRoutes = collections.map(collection => ({
    url: `${BASE_URL}/collections/${collection.slug}`,
    lastModified: collection.updatedAt ? new Date(collection.updatedAt) : currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Category pages (derived from products)
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const categoryRoutes = categories.map(category => ({
    url: `${BASE_URL}/catalog?category=${encodeURIComponent(category)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes, ...categoryRoutes];
}
