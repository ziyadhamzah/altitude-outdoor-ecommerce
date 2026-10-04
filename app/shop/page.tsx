import type { Metadata } from 'next';
import Link from 'next/link';

import { CATEGORY_LABELS, PRODUCT_CATEGORIES, type SortId } from '@/types/product';
import { SORT_OPTIONS } from '@/types/product';
import { filterProducts } from '@/lib/catalog';
import { products } from '@/data/products';
import { ProductGrid } from '@/components/product/product-grid';

export const metadata: Metadata = {
  title: 'Shop all gear',
  description:
    'Browse the full ALTITUDE collection: apparel, bags, footwear and accessories for hiking, camping and travel.',
};

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const readParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const query = readParam(params.q);
  const categoryParam = readParam(params.category);
  const sortParam = readParam(params.sort);

  const category = PRODUCT_CATEGORIES.includes(categoryParam as never)
    ? (categoryParam as (typeof PRODUCT_CATEGORIES)[number])
    : 'all';
  const sort = (SORT_OPTIONS.find((option) => option.id === sortParam)?.id ??
    'featured') as SortId;

  const results = filterProducts(products, { query, category, sort });

  const buildHref = (next: { category?: string; sort?: string }) => {
    const search = new URLSearchParams();
    if (query) search.set('q', query);
    if (next.category ?? category !== 'all') search.set('category', next.category ?? category);
    const nextSort = next.sort ?? sort;
    if (nextSort !== 'featured') search.set('sort', nextSort);
    const qs = search.toString();
    return qs ? `/shop?${qs}` : '/shop';
  };

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="alt-eyebrow alt-eyebrow-bronze">The collection</p>
          <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">
            {category === 'all' ? 'Shop all' : CATEGORY_LABELS[category]}
          </h1>
        </div>

        <form action="/shop" method="get" className="flex w-full max-w-sm gap-3">
          {category !== 'all' ? <input type="hidden" name="category" value={category} /> : null}
          <label htmlFor="shop-search" className="sr-only">
            Search products
          </label>
          <input
            id="shop-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Search the collection"
            className="field flex-1"
          />
          <button type="submit" className="btn btn-dark">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Categories" className="rail -mx-1 flex gap-5 overflow-x-auto px-1 md:gap-7">
          <Link
            href={buildHref({ category: 'all' })}
            aria-current={category === 'all'}
            className={`shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-60 ${
              category === 'all' ? 'text-ink underline underline-offset-8' : 'text-muted'
            }`}
          >
            All
          </Link>
          {PRODUCT_CATEGORIES.map((item) => (
            <Link
              key={item}
              href={buildHref({ category: item })}
              aria-current={category === item}
              className={`shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-60 ${
                category === item ? 'text-ink underline underline-offset-8' : 'text-muted'
              }`}
            >
              {CATEGORY_LABELS[item]}
            </Link>
          ))}
        </nav>

        <nav aria-label="Sort" className="rail -mx-1 flex gap-5 overflow-x-auto px-1 md:gap-6">
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.id}
              href={buildHref({ sort: option.id })}
              aria-current={sort === option.id}
              className={`shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-60 ${
                sort === option.id ? 'text-ink underline underline-offset-8' : 'text-muted'
              }`}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="border-t border-line pt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
        {results.length} {results.length === 1 ? 'product' : 'products'}
        {query ? ` for “${query}”` : ''}
      </p>

      {results.length > 0 ? (
        <div className="mt-10">
          <ProductGrid products={results} columns={4} priorityCount={4} />
        </div>
      ) : (
        <div className="mt-10 border border-line p-10">
          <h2 className="font-display text-2xl tracking-[-0.02em] uppercase">No products found.</h2>
          <p className="mt-3 max-w-sm text-sm text-muted">
            Nothing matches that combination yet. Try a different search term or reset the filters.
          </p>
          <Link href="/shop" className="btn btn-dark mt-8">
            Clear search
          </Link>
        </div>
      )}
    </div>
  );
}
