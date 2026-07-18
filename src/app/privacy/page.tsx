import PrivacyClient from './PrivacyClient';

export const metadata = {
  title: 'Privacy Policy - CLOTHI',
  description: 'Read the CLOTHI Privacy Policy. Learn how we collect, protect, and use your personal information when you shop our premium streetwear collections.',
  keywords: [
    'CLOTHI privacy policy',
    'data protection',
    'privacy streetwear shop',
    'ethical e-commerce privacy',
    'user data policy',
  ],
  openGraph: {
    title: 'Privacy Policy | CLOTHI',
    description: 'Read the CLOTHI Privacy Policy. Learn how we collect, protect, and use your personal information.',
    type: 'website',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - CLOTHI",
    "description": "Read the CLOTHI Privacy Policy. Learn how we collect, protect, and use your personal information when you shop our premium streetwear collections.",
    "publisher": {
      "@type": "Organization",
      "name": "CLOTHI",
      "logo": "https://clothi.co.in/logo.png"
    },
    "datePublished": "2026-06-17",
    "dateModified": "2026-06-17"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyClient />
    </>
  );
}
