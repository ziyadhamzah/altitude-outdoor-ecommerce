import type { Metadata } from 'next';

import { AdventureBanner } from '@/components/home/adventure-banner';
import { BrandStory } from '@/components/home/brand-story';
import { CategorySection } from '@/components/home/category-section';
import { FeaturedGear } from '@/components/home/featured-gear';
import { Hero } from '@/components/home/hero';
import { NewArrivals } from '@/components/home/new-arrivals';

export const metadata: Metadata = {
  title: 'ALTITUDE — Gear for a Higher Journey',
  description: 'Premium outdoor gear for hiking, camping, travel, and adventure.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedGear />
      <CategorySection />
      <NewArrivals />
      <BrandStory />
      <AdventureBanner />
    </>
  );
}
