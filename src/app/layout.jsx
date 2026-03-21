import './globals.css';
import Navbar from '../components/Navbar';
import AnnouncementBar from '../components/AnnouncementBar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Clothi — Coastal Essentials',
  description: 'Premium coastal lifestyle apparel. Sun-drenched softness crafted from organic pima cotton.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
