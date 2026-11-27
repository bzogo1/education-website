import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="bg-bgDark1 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-primaryColor mb-4 text-8xl font-bold sm:text-9xl">404</h1>
        <h2 className="text-primaryText mb-4 text-2xl font-bold sm:text-3xl">Page not found</h2>
        <p className="text-secondaryText mb-10 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="contained-button px-8 py-3 text-lg">
          {' '}
          Back to Home{' '}
        </a>
      </section>
      <Footer />
    </>
  );
}
