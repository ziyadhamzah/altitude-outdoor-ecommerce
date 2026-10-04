import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductGallery } from '@/components/product/product-gallery';
import { ProductGrid } from '@/components/product/product-grid';
import { PurchasePanel } from '@/components/product/purchase-panel';
import { StockLabel } from '@/components/ui/stock-label';
import { getProductBySlug, getRelatedProducts, products } from '@/data/products';
import { SHIPPING_OPTIONS } from '@/data/shipping';
import { getStockState } from '@/lib/catalog';
import { formatIDR, formatNumber, formatRating } from '@/lib/format';
import { CATEGORY_LABELS } from '@/types/product';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () => products.map((product) => ({ slug: product.slug }));

/**
 * The catalog is fully static. Unknown slugs are rejected by the router with a
 * real 404 status and the store-wide not-found page, instead of being rendered
 * on demand and streamed as a 200.
 */
export const dynamicParams = false;

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
  const summary = product.description.split('. ').slice(0, 2).join('. ');

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase">
          <li>
            <Link href="/shop" className="transition-colors hover:text-ink">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/shop?category=${product.category}`}
              className="transition-colors hover:text-ink"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <p className="alt-eyebrow alt-eyebrow-bronze">{CATEGORY_LABELS[product.category]}</p>
          <h1 className="mt-5 text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[-0.035em] uppercase">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <p className="font-mono text-lg">{formatIDR(product.price)}</p>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
              {formatRating(product.rating)} / 5 · Based on {formatNumber(product.reviews)} reviews
            </p>
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">{summary}.</p>

          <PurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-20 grid gap-12 border-t border-line pt-12 md:mt-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="alt-eyebrow">Description</h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">{product.description}</p>

          <h2 className="alt-eyebrow mt-14">Product details</h2>
          <dl className="mt-6 max-w-2xl border-t border-line">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-baseline justify-between gap-6 border-b border-line py-3"
              >
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
                  {spec.label}
                </dt>
                <dd className="text-right text-sm">{spec.value}</dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
              <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">
                Material
              </dt>
              <dd className="text-right text-sm">{product.material}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-5">
          <h2 className="alt-eyebrow">Built for the journey</h2>
          <ul className="mt-6 border-t border-line">
            {(product.features ?? []).map((feature) => (
              <li key={feature} className="border-b border-line py-4 text-sm leading-relaxed">
                {feature}
              </li>
            ))}
          </ul>

          <h2 className="alt-eyebrow mt-14">Shipping</h2>
          <ul className="mt-6 border-t border-line">
            {SHIPPING_OPTIONS.map((option) => (
              <li
                key={option.id}
                className="flex items-baseline justify-between gap-6 border-b border-line py-3"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
                  {option.label}
                  <span className="ml-3 tracking-normal text-muted normal-case">{option.estimate}</span>
                </span>
                <span className="font-mono text-sm">{formatIDR(option.cost)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">
            Free shipping on orders above Rp1.500.000. Orders are packed in Bandung and handed to the
            courier within one business day.
          </p>

          <h2 className="alt-eyebrow mt-14">Reviews</h2>
          <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
            {formatRating(product.rating)} / 5 · {formatNumber(product.reviews)} ratings
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Rating information comes from the catalog. Written reviews are not part of this
            demonstration store.
          </p>

          <h2 className="alt-eyebrow mt-14">Availability</h2>
          <div className="mt-6">
            <StockLabel label={stockState.label} detail={stockState.detail} tone={stockState.tone} />
          </div>
        </div>
      </div>

      <section className="mt-20 md:mt-28">
        <div className="flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="alt-eyebrow">You may also like</p>
            <h2 className="mt-5 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.03em] uppercase">
              Complete the kit
            </h2>
          </div>
          <Link
            href="/shop"
            className="alt-link shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase"
          >
            Shop all gear
          </Link>
        </div>
        <div className="mt-12">
          <ProductGrid products={related} />
        </div>
      </section>
    </div>
  );
}