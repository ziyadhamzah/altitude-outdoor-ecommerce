import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { formatIDR } from '@/lib/format';
import type { CartLine } from '@/types/cart';

type CheckoutSummaryProps = {
  lines: CartLine[];
  shippingCost: number;
  estimatedDelivery?: string;
  /** Primary action for the current step. */
  children?: ReactNode;
};

export const CheckoutSummary = ({
  lines,
  shippingCost,
  estimatedDelivery,
  children,
}: CheckoutSummaryProps) => {
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const count = lines.reduce((total, line) => total + line.item.quantity, 0);

  return (
    <div className="border border-line bg-white p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Order summary</h2>
        <p className="font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          {count} {count === 1 ? 'item' : 'items'}
        </p>
      </div>

      <ul className="mt-6 border-t border-line">
        {lines.map((line) => (
          <li key={line.key} className="grid grid-cols-[3.25rem_1fr] gap-4 border-b border-line py-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              {line.product.images?.[0] ? (
                <Image
                  src={line.product.images[0]}
                  alt=""
                  fill
                  sizes="52px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-snug">{line.product.name}</p>
              {line.variantLabel ? (
                <p className="mt-1 font-mono text-[0.625rem] tracking-[0.12em] text-muted uppercase">
                  {line.variantLabel}
                </p>
              ) : null}
              <p className="mt-1 font-mono text-[0.6875rem] text-muted">
                Qty {line.item.quantity} · {formatIDR(line.lineTotal)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-mono">{formatIDR(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd className={cn('font-mono', shippingCost === 0 && 'text-positive')}>
            {shippingCost === 0 ? 'FREE' : formatIDR(shippingCost)}
          </dd>
        </div>
        {estimatedDelivery ? (
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">Estimated delivery</dt>
            <dd className="text-sm">{estimatedDelivery}</dd>
          </div>
        ) : null}
        <div className="rule my-5" />
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">Total</dt>
          <dd className="font-mono text-lg">{formatIDR(subtotal + shippingCost)}</dd>
        </div>
      </dl>

      {children ? <div className="mt-8">{children}</div> : null}

      <div className="mt-4 text-center">
        <Link
          href="/cart"
          className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink"
        >
          Edit cart
        </Link>
      </div>

      <p className="mt-6 font-mono text-[0.625rem] leading-relaxed tracking-[0.16em] text-muted uppercase">
        Simulated order — no payment is processed and no data leaves your browser.
      </p>
    </div>
  );
};