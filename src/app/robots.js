/**
 * Robots.txt Configuration for CLOTHI E-commerce
 * Controls search engine crawling behavior
 */

const BASE_URL = 'https://clothi.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/checkout/',  // Don't index checkout process
          '/cart/',      // Don't index cart pages
          '/account/',   // Don't index account settings
          '/orders/',    // Don't index order history
          '/favorites/', // Don't index favorites
          '/login',
          '/register',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          '/checkout/',
          '/cart/',
          '/account/',
          '/orders/',
          '/favorites/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
