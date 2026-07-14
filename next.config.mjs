/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    qualities: [75, 80, 90],
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'dd9ioxqho.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'powerlook.in' },
    ],
  },
  // Content Security Policy & Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://www.googletagmanager.com https://www.gstatic.com https://www.google.com https://apis.google.com https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://dd9ioxqho.cloudinary.com https://lh3.googleusercontent.com https://images.unsplash.com https://powerlook.in https://clothi-backend.onrender.com https://www.gstatic.com https://*.razorpay.com https://razorpay.com",
              "media-src 'self' blob: https://res.cloudinary.com",
              "connect-src 'self' https://accounts.google.com http://localhost:3001 https://clothi-backend.onrender.com https://api.clothi.co.in https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://clothi-db37d.firebaseapp.com https://api.razorpay.com",
              "frame-src https://accounts.google.com https://clothi-db37d.firebaseapp.com https://www.google.com https://www.gstatic.com https://checkout.razorpay.com https://api.razorpay.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};
export default nextConfig;
