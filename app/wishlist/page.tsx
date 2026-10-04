'use client';

import Link from 'next/link';

import { ProductGrid } from '@/components/product/product-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { getProductById } from '@/data/products';
import { useHydrated } from '@/lib/use-hydrated';
import { useWishlistStore } from '@/store/wishlist';

export default function WishlistPage() {
  const hydrated = useHydrated();
  const productIds = useWishlistStore((state) => state.productIds);

  const saved = productIds
    .map((id) => getProductById(id))
    .filter((product) => product !== undefined);

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <p className="alt-eyebrow alt-eyebrow-bronze">Saved for later</p>
      <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">
        Wishlist
      </h1>

      {!hydrated ? (
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          Loading wishlist…
        </p>
      ) : saved.length === 0 ? (
        <div className="mt-16 border-t border-line pt-12">
          <EmptyState
            eyebrow="No saved pieces"
            title="YOUR WISHLIST IS EMPTY."
            description="Save the gear you are still thinking about and it will wait for you here."
            action={{ label: 'Browse the collection', href: '/shop' }}
          />
        </div>
      ) : (
        <div className="mt-12 md:mt-16">
          <ProductGrid products={saved} />
          <div className="mt-16 border-t border-line pt-8">
            <Link
              href="/shop"
              className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
