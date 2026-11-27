import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features1 from '@/components/Features1';
import Features2 from '@/components/Features2';
import FeaturesDiagonal from '@/components/FeaturesDiagonal';
import Brands from '@/components/Brands';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Pattern from '@/components/ui/v-accordion-11';
import CtaBottom from '@/components/CtaBottom';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';

export const metadata: Metadata = {
  title: { absolute: 'Tailcast' },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features1 />
      <Features2 />
      <FeaturesDiagonal />
      <Brands />
      <Gallery />
      <Testimonials />
      <Pattern />
      <CtaBottom />
      <Footer />
      <ScrollUpButton />
    </>
  );
}
