'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/cn';
import {
  CATEGORY_LABELS,
  PRICE_RANGES,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  type PriceRangeId,
  type ProductCategory,
  type SortId,
} from '@/types/product';

type ShopFiltersProps = {
  query: string;
  category: ProductCategory | 'all';
  price: PriceRangeId;
  sort: SortId;
};

type FilterState = {
  q: string;
  category: ProductCategory | 'all';
  price: PriceRangeId;
  sort: SortId;
};

const OPTION =
  'shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-100';

const optionClass = (active: boolean) =>
  cn(OPTION, active ? 'text-ink underline underline-offset-8' : 'text-muted opacity-70');

const buildShopHref = (state: FilterState): string => {
  const search = new URLSearchParams();
  const term = state.q.trim();
  if (term) search.set('q', term);
  if (state.category !== 'all') search.set('category', state.category);
  if (state.price !== 'all') search.set('price', state.price);
  if (state.sort !== 'featured') search.set('sort', state.sort);
  const qs = search.toString();
  return qs ? `/shop?${qs}` : '/shop';
};

export const ShopFilters = ({ query, category, price, sort }: ShopFiltersProps) => {
  const router = useRouter();
  const [text, setText] = useState(query);

  const current = buildShopHref({ q: query, category, price, sort });
  const pending = buildShopHref({ q: text, category, price, sort });

  useEffect(() => {
    if (pending === current) return;
    const timer = window.setTimeout(() => {
      router.replace(pending, { scroll: false });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [pending, current, router]);

  const href = (next: Partial<FilterState>) =>
    buildShopHref({ q: text, category, price, sort, ...next });

  return (
    <div className="mt-10 border-t border-line">
      <div className="flex flex-col gap-3 border-b border-line py-4 md:flex-row md:items-center md:gap-10 md:py-5">
        <p className="alt-eyebrow w-24 shrink-0">Search</p>
        <div className="flex flex-1 items-center gap-6">
          <input
            id="shop-search"
            name="q"
            type="search"
            value={text}
            autoComplete="off"
            spellCheck={false}
            placeholder="SEARCH PRODUCTS"
            aria-label="Search products"
            onChange={(event) => setText(event.target.value)}
            className="w-full border-0 border-b border-line bg-transparent pb-2 font-mono text-[0.6875rem] tracking-[0.2em] uppercase outline-none transition-colors placeholder:text-muted/70 focus:border-ink"
          />
          {text ? (
            <button
              type="button"
              onClick={() => setText('')}
              className="shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase underline underline-offset-8 transition-opacity hover:opacity-60"
            >
              Clear search
            </button>
          ) : null}
        </div>
      </div>

      <nav
        aria-label="Filter by category"
        className="flex flex-col gap-3 border-b border-line py-4 md:flex-row md:items-center md:gap-10 md:py-5"
      >
        <p className="alt-eyebrow w-24 shrink-0">Category</p>
        <div className="rail -mx-1 flex gap-6 overflow-x-auto px-1 md:gap-8">
          <Link
            href={href({ category: 'all' })}
            scroll={false}
            aria-current={category === 'all'}
            className={optionClass(category === 'all')}
          >
            All
          </Link>
          {PRODUCT_CATEGORIES.map((item) => (
            <Link
              key={item}
              href={href({ category: item })}
              scroll={false}
              aria-current={category === item}
              className={optionClass(category === item)}
            >
              {CATEGORY_LABELS[item]}
            </Link>
          ))}
        </div>
      </nav>

      <nav
        aria-label="Filter by price"
        className="flex flex-col gap-3 border-b border-line py-4 md:flex-row md:items-center md:gap-10 md:py-5"
      >
        <p className="alt-eyebrow w-24 shrink-0">Price</p>
        <div className="rail -mx-1 flex gap-6 overflow-x-auto px-1 md:gap-8">
          {PRICE_RANGES.map((range) => (
            <Link
              key={range.id}
              href={href({ price: range.id })}
              scroll={false}
              aria-current={price === range.id}
              className={optionClass(price === range.id)}
            >
              {range.label}
            </Link>
          ))}
        </div>
      </nav>

      <nav
        aria-label="Sort products"
        className="flex flex-col gap-3 border-b border-line py-4 md:flex-row md:items-center md:gap-10 md:py-5"
      >
        <p className="alt-eyebrow w-24 shrink-0">Sort</p>
        <div className="rail -mx-1 flex gap-6 overflow-x-auto px-1 md:gap-8">
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.id}
              href={href({ sort: option.id })}
              scroll={false}
              aria-current={sort === option.id}
              className={optionClass(sort === option.id)}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};