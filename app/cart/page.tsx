'use client';

import Link from 'next/link';

import { CartLineItem } from '@/components/cart/cart-line-item';
import { EmptyState } from '@/components/ui/empty-state';
import { getAvailableLines, getCartCount, getCartEntries, getCartSubtotal } from '@/lib/cart';
import { formatIDR } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';
import { useCartStore } from '@/store/cart';

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  const entries = getCartEntries(items);
  const lines = getAvailableLines(entries);
  const subtotal = getCartSubtotal(lines);
  const count = getCartCount(items);
  const itemLabel = `${count} ${count === 1 ? 'item' : 'items'}`;

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Your selection</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
              Cart
            </h1>
            <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.24em] uppercase">
              Your gear, ready for the journey.
            </p>
          </div>
          {hydrated && count > 0 ? (
            <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase md:text-right">
              {itemLabel}
            </p>
          ) : null}
        </div>
      </header>

      {!hydrated ? (
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          Loading cart…
        </p>
      ) : entries.length === 0 ? (
        <div className="flex min-h-[45svh] flex-col justify-center py-16">
          <EmptyState
            eyebrow="Nothing here yet"
            title="Your cart is empty"
            description="No gear has been added to your journey yet."
            action={{ label: 'Explore the shop', href: '/shop' }}
          />
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Your cart</h2>
              <button
                type="button"
                onClick={clear}
                className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase underline underline-offset-4 transition-colors duration-300 hover:text-critical"
              >
                Clear cart
              </button>
            </div>

            <ul className="mt-6 border-t border-line">
              {entries.map((entry) =>
                entry.kind === 'available' ? (
                  <CartLineItem key={entry.key} line={entry} />
                ) : (
                  <li
                    key={entry.key}
                    className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-6"
                  >
                    <div>
                      <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-critical uppercase">
                        Product unavailable
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        This piece is no longer in the catalog and cannot be ordered.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(entry.key)}
                      aria-label="Remove unavailable product"
                      className="font-mono text-[0.625rem] tracking-[0.2em] uppercase underline underline-offset-4 transition-colors duration-300 hover:text-critical"
                    >
                      Remove
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-line bg-white p-6 lg:sticky lg:top-28">
              <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">
                Order summary
              </h2>

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
                Checkout
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
}