import { getFeaturedProducts } from '@/data/products';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHeading } from '@/components/ui/section-heading';

export const FeaturedGear = () => {
  const featured = getFeaturedProducts();

  return (
    <section className="alt-container py-20 md:py-28">
      <SectionHeading
        eyebrow="Featured gear"
        title="Equipment for every kind of journey."
        description="The pieces we build, test and repair ourselves — chosen for long days out, not short walks around the block."
        link={{ label: 'View all gear', href: '/shop' }}
      />
      <div className="mt-12 md:mt-16">
        <ProductGrid products={featured} />
      </div>
    </section>
  );
};
