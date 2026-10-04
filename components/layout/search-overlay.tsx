'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';

import { products } from '@/data/products';
import { filterProducts } from '@/lib/catalog';
import { formatIDR } from '@/lib/format';
import { CATEGORY_LABELS } from '@/types/product';

type SearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const close = useCallback(() => {
    setQuery('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  const results = useMemo(
    () => (query.trim() ? filterProducts(products, { query, sort: 'featured' }).slice(0, 6) : []),
    [query],
  );

  if (!open) return null;

  const goToShop = () => {
    const term = query.trim();
    close();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : '/shop');
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-offwhite pt-16 md:pt-20">
      <div className="alt-container pb-24">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <label htmlFor="site-search" className="alt-eyebrow">
            Search the collection
          </label>
          <button
            type="button"
            onClick={close}
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
          >
            Close
          </button>
        </div>

        <input
          id="site-search"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') goToShop();
          }}
          placeholder="Jacket, backpack, lamp…"
          className="mt-8 w-full border-0 border-b border-line bg-transparent pb-4 font-display text-[clamp(1.75rem,5vw,3rem)] leading-none tracking-[-0.03em] outline-none placeholder:text-muted/50 focus:border-ink"
        />

        {query.trim() ? (
          <div className="mt-10">
            <p className="alt-eyebrow">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'}`
                : 'No products found.'}
            </p>

            {results.length > 0 ? (
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={close}
                      className="group flex items-center gap-5 py-4 transition-opacity hover:opacity-70"
                    >
                      <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-charcoal">
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[0.625rem] tracking-[0.2em] text-bronze uppercase">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                        <span className="mt-1.5 block truncate text-base">{product.name}</span>
                      </span>
                      <span className="shrink-0 font-mono text-sm">{formatIDR(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 border border-line p-8">
                <p className="font-display text-xl tracking-[-0.02em]">NO PRODUCTS FOUND.</p>
                <button type="button" onClick={() => setQuery('')} className="alt-link mt-4 font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
                  Clear search
                </button>
              </div>
            )}

            <button type="button" onClick={goToShop} className="btn btn-dark mt-10">
              View all results
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {['Jacket', 'Backpack', 'Headlamp'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="border border-line px-5 py-4 text-left font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-colors hover:border-ink"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
