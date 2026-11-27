import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import SyncAppsShowcase from '@/components/SyncAppsShowcase';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore Tailcast opportunities.',
};

export default function ExplorePage() {
  return (
    <>
      <Navbar />
      <SyncAppsShowcase />
      <Footer />
      <ScrollUpButton />
    </>
  );
}
