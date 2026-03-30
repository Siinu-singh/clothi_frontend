// About page metadata export
export const metadata = {
  title: 'About Us - Our Story & Mission',
  description: 'Discover the CLOTHI story. Founded in 2019, we craft sustainable coastal apparel from organic pima cotton. Learn about our commitment to ethical fashion, carbon neutrality, and supporting artisan communities worldwide.',
  keywords: [
    'about CLOTHI',
    'sustainable fashion brand',
    'ethical clothing company',
    'organic cotton brand',
    'eco-friendly fashion',
    'carbon neutral clothing',
    'fair trade fashion',
    'coastal lifestyle brand',
  ],
  openGraph: {
    title: 'About Us | CLOTHI - Sustainable Fashion',
    description: 'Discover the CLOTHI story. Founded in 2019, we craft sustainable coastal apparel from organic pima cotton.',
    type: 'website',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

// Re-export the client component
export { default } from './AboutClient';
