'use client';

import Link from 'next/link';

import { CartLineItem } from '@/components/cart/cart-line-item';
import { EmptyState } from '@/components/ui/empty-state';
import { getCartLines, getCartSubtotal } from '@/lib/cart';
import { formatIDR } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';
import { useCartStore } from '@/store/cart';

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const lines = getCartLines(items);
  const subtotal = getCartSubtotal(lines);

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <p className="alt-eyebrow alt-eyebrow-bronze">Your selection</p>
      <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">
        Cart
      </h1>

      {!hydrated ? (
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          Loading cart…
        </p>
      ) : lines.length === 0 ? (
        <div className="mt-16 border-t border-line pt-12">
          <EmptyState
            eyebrow="Nothing here yet"
            title="YOUR CART IS EMPTY."
            description="Once you add a piece of gear it will stay here, even after you close the browser."
            action={{ label: 'Browse the collection', href: '/shop' }}
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ul className="border-t border-line">
              {lines.map((line) => (
                <CartLineItem key={line.key} line={line} />
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-white p-6 lg:sticky lg:top-28">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Summary</h2>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="font-mono">{formatIDR(subtotal)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="font-mono text-muted">Calculated at checkout</dd>
                </div>
                <div className="rule my-5" />
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">Total</dt>
                  <dd className="font-mono text-lg">{formatIDR(subtotal)}</dd>
                </div>
              </dl>

              <Link href="/checkout" className="btn btn-dark mt-8 w-full">
                Proceed to checkout
              </Link>
              <Link
                href="/shop"
                className="mt-4 block text-center font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink"
              >
                Continue shopping
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
