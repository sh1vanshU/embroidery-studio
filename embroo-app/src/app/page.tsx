import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { BestSellers } from '@/components/landing/BestSellers';
import { WhyEmbroo } from '@/components/landing/WhyEmbroo';
import { CustomerGallery } from '@/components/landing/CustomerGallery';
import { Testimonials } from '@/components/landing/Testimonials';
import { Newsletter } from '@/components/landing/Newsletter';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <HowItWorks />
        <ProductShowcase />
        <BestSellers />
        <WhyEmbroo />
        <CustomerGallery />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
