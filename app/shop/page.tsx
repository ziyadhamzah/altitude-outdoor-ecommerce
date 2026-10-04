import type { Metadata } from 'next';
import Link from 'next/link';

import { ProductGrid } from '@/components/product/product-grid';
import { ShopFilters } from '@/components/shop/shop-filters';
import { products } from '@/data/products';
import { filterProducts, getPriceRange, isPriceRangeId } from '@/lib/catalog';
import {
  CATEGORY_LABELS,
  PRICE_RANGES,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  type PriceRangeId,
  type ProductCategory,
  type SortId,
} from '@/types/product';

export const metadata: Metadata = {
  title: 'Shop all gear',
  description:
    'Browse the full ALTITUDE collection: apparel, bags, footwear and accessories for hiking, camping and travel.',
  alternates: { canonical: '/shop' },
};

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const readParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

const isCategory = (value: string): value is ProductCategory =>
  PRODUCT_CATEGORIES.includes(value as ProductCategory);

const isSortId = (value: string): value is SortId =>
  SORT_OPTIONS.some((option) => option.id === value);

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  const query = readParam(params.q).trim();
  const categoryParam = readParam(params.category);
  const priceParam = readParam(params.price);
  const sortParam = readParam(params.sort);

  const category: ProductCategory | 'all' = isCategory(categoryParam) ? categoryParam : 'all';
  const price: PriceRangeId = isPriceRangeId(priceParam) ? priceParam : 'all';
  const sort: SortId = isSortId(sortParam) ? sortParam : 'featured';
  const range = getPriceRange(price);

  const results = filterProducts(products, {
    query,
    category,
    minPrice: range.min,
    maxPrice: range.max,
    sort,
  });

  const activePrice = PRICE_RANGES.find((item) => item.id === price) ?? PRICE_RANGES[0];
  const hasFilters = Boolean(query) || category !== 'all' || price !== 'all' || sort !== 'featured';

  const clearHref = (() => {
    const search = new URLSearchParams();
    if (category !== 'all') search.set('category', category);
    if (price !== 'all') search.set('price', price);
    if (sort !== 'featured') search.set('sort', sort);
    const qs = search.toString();
    return qs ? `/shop?${qs}` : '/shop';
  })();

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-10">
        <p className="alt-eyebrow alt-eyebrow-bronze">The collection</p>

        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="text-[clamp(3rem,11vw,7.5rem)] leading-[0.85] tracking-[-0.045em] uppercase">
            Shop
          </h1>

          <div className="md:max-w-sm md:text-right">
            <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase">
              {products.length} products
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Explore the gear built for your next journey.
            </p>
          </div>
        </div>
      </header>

      <ShopFilters query={query} category={category} price={price} sort={sort} />

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <p className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
          {query ? (
            <>
              Search results for <span className="text-bronze">“{query}”</span>
            </>
          ) : category !== 'all' ? (
            <>Category: {CATEGORY_LABELS[category]}</>
          ) : (
            'All products'
          )}
        </p>

        <div className="flex items-baseline gap-6">
          {sort !== 'featured' ? (
            <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
              {SORT_OPTIONS.find((option) => option.id === sort)?.label}
            </p>
          ) : null}
          <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase">
            {results.length} {results.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="mt-10 md:mt-12">
          <ProductGrid products={results} columns={4} priorityCount={4} />
        </div>
      ) : (
        <div className="mt-10 border border-line p-8 md:p-12">
          <p className="alt-eyebrow alt-eyebrow-bronze">No matches</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.03em] uppercase">
            No products found.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Nothing matches that combination. Widen the price band, choose another category, or
            clear the search to see all {products.length} products.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {query ? (
              <Link href={clearHref} className="btn btn-dark" scroll={false}>
                Clear search
              </Link>
            ) : null}
            <Link
              href="/shop"
              scroll={false}
              className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase underline underline-offset-8 transition-opacity hover:opacity-60"
            >
              {hasFilters ? 'Reset all filters' : 'Back to all products'}
            </Link>
          </div>

          {price !== 'all' || category !== 'all' ? (
            <p className="mt-8 border-t border-line pt-4 font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
              Active: {category !== 'all' ? CATEGORY_LABELS[category] : 'All categories'} ·{' '}
              {activePrice.label}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}