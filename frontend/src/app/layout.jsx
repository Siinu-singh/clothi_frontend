import './globals.css';
import Navbar from '../components/Navbar';
import AnnouncementBar from '../components/AnnouncementBar';
import Footer from '../components/Footer';
import Providers from '../components/Providers';
import { Analytics } from "@vercel/analytics/react";
import { JsonLd } from '../components/seo/JsonLd';

// Viewport configuration (separate export required in Next.js 14+)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

// Root metadata with SEO optimization
export const metadata = {
  metadataBase: new URL('https://clothi.com'),
  title: {
    default: 'CLOTHI — Premium Coastal Lifestyle Apparel',
    template: '%s | CLOTHI',
  },
  description: 'Discover sustainable, premium coastal lifestyle apparel. Sun-drenched softness crafted from organic pima cotton. Ethical fashion for men and women. Free shipping on orders over $100.',
  keywords: [
    'sustainable fashion',
    'coastal lifestyle',
    'organic cotton clothing',
    'premium apparel',
    'ethical fashion',
    'mens clothing',
    'womens clothing',
    'eco-friendly fashion',
    'sustainable clothing brand',
    'organic pima cotton',
  ],
  authors: [{ name: 'CLOTHI' }],
  creator: 'CLOTHI',
  publisher: 'CLOTHI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clothi.com',
    siteName: 'CLOTHI',
    title: 'CLOTHI — Premium Coastal Lifestyle Apparel',
    description: 'Discover sustainable, premium coastal lifestyle apparel. Sun-drenched softness crafted from organic pima cotton.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CLOTHI - Sustainable Coastal Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLOTHI — Premium Coastal Lifestyle Apparel',
    description: 'Discover sustainable, premium coastal lifestyle apparel. Sun-drenched softness crafted from organic pima cotton.',
    images: ['/og-image.png'],
    creator: '@clothi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://clothi.com/',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'ecommerce',
};

// Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CLOTHI',
  url: 'https://clothi.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://clothi.com/logo.png',
    width: 512,
    height: 512,
  },
  description: 'Premium sustainable coastal lifestyle apparel crafted from organic pima cotton.',
  sameAs: [
    'https://twitter.com/clothi',
    'https://instagram.com/clothi',
    'https://facebook.com/clothi',
    'https://pinterest.com/clothi',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@clothi.com',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  foundingDate: '2019',
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
};

// WebSite Schema with Search Action
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CLOTHI',
  url: 'https://clothi.com',
  description: 'Premium sustainable coastal lifestyle apparel',
  inLanguage: 'en',
  publisher: {
    '@type': 'Organization',
    name: 'CLOTHI',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://clothi.com/catalog?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <Providers>
          <AnnouncementBar />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
