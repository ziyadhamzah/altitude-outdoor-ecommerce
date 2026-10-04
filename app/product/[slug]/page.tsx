import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductGallery } from '@/components/product/product-gallery';
import { ProductGrid } from '@/components/product/product-grid';
import { PurchasePanel } from '@/components/product/purchase-panel';
import { SectionHeading } from '@/components/ui/section-heading';
import { getProductBySlug, getRelatedProducts, products } from '@/data/products';
import { SHIPPING_OPTIONS } from '@/data/shipping';
import { getStockState } from '@/lib/catalog';
import { formatIDR, formatRating } from '@/lib/format';
import { CATEGORY_LABELS } from '@/types/product';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => products.map((product) => ({ slug: product.slug }));

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: 'Product not found' };
  }

  const description = product.description.slice(0, 158);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} — ALTITUDE`,
      description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const stockState = getStockState(product);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <nav aria-label="Breadcrumb" className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href={`/shop?category=${product.category}`} className="transition-colors hover:text-ink">
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <p className="alt-eyebrow alt-eyebrow-bronze">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[-0.035em] uppercase">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="font-mono text-lg">{formatIDR(product.price)}</p>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
              {formatRating(product.rating)} / 5 · {product.reviews} reviews
            </p>
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">
            {product.description.split('. ').slice(0, 2).join('. ')}.
          </p>

          <PurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16 md:mt-28">
        <div className="lg:col-span-7">
          <h2 className="alt-eyebrow">Description</h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{product.description}</p>

          <h2 className="alt-eyebrow mt-14">Specifications</h2>
          <dl className="mt-6 max-w-2xl border-t border-line">
            {product.specs.map((spec) => (
              <div key={spec.label} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
                  {spec.label}
                </dt>
                <dd className="text-right text-sm">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="alt-eyebrow mt-14">Material</h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{product.material}.</p>
        </div>

        <div className="lg:col-span-5">
          <h2 className="alt-eyebrow">Shipping</h2>
          <ul className="mt-6 border-t border-line">
            {SHIPPING_OPTIONS.map((option) => (
              <li
                key={option.id}
                className="flex items-baseline justify-between gap-6 border-b border-line py-3"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
                  {option.label}
                  <span className="ml-3 text-muted normal-case tracking-normal">{option.estimate}</span>
                </span>
                <span className="font-mono text-sm">{formatIDR(option.cost)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Orders are packed in Bandung and handed to the courier within one business day.
          </p>

          <h2 className="alt-eyebrow mt-14">Reviews</h2>
          <p className="mt-6 text-sm text-muted">
            {formatRating(product.rating)} out of 5, based on {product.reviews} ratings. Written
            reviews are not part of this demonstration store.
          </p>

          <h2 className="alt-eyebrow mt-14">Availability</h2>
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.18em] uppercase">
            {stockState.label} · {product.stock} units in catalog
          </p>
        </div>
      </div>

      <section className="mt-20 md:mt-28">
        <SectionHeading
          eyebrow="Complete the kit"
          title="Related products"
          link={{ label: 'Shop all gear', href: '/shop' }}
        />
        <div className="mt-12">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}
