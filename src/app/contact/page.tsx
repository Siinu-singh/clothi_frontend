// Contact page metadata export
export const metadata = {
  title: 'Contact Us - Get in Touch',
  description: 'Reach out to the CLOTHI customer care team. Get support with orders, sizing advice, returns, or share your feedback with us.',
  keywords: [
    'contact CLOTHI',
    'customer support',
    'ethical fashion support',
    'order help',
    'coastal apparel contact',
    'returns and exchanges',
  ],
  openGraph: {
    title: 'Contact Us | CLOTHI - Sustainable Fashion',
    description: 'Reach out to the CLOTHI customer care team for help with your orders or sizing.',
    type: 'website',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/contact',
  },
};

// Re-export the client component
export { default } from './ContactClient';
