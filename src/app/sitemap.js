/**
 * Dynamic Sitemap for CLOTHI E-commerce
 * Generates sitemap.xml with all pages and products
 */

const BASE_URL = 'https://clothi.com';

// Static pages with their priorities and change frequencies
const staticPages = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/catalog', priority: 0.9, changeFrequency: 'daily' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/register', priority: 0.3, changeFrequency: 'yearly' },
];

// Fetch products from API for dynamic product pages
async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`, {
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

export default async function sitemap() {
  const products = await getProducts();
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
    // Next.js 14+ supports images in sitemap
    images: product.images?.length > 0 
      ? product.images 
      : product.image 
        ? [product.image] 
        : [],
  }));

  // Category pages (derived from products)
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const categoryRoutes = categories.map(category => ({
    url: `${BASE_URL}/catalog?category=${encodeURIComponent(category)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
