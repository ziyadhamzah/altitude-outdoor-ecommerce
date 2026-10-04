'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { QuantitySelector } from '@/components/ui/quantity-selector';
import { StockLabel } from '@/components/ui/stock-label';
import { getStockState } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { formatIDR } from '@/lib/format';
import { useCartStore } from '@/store/cart';
import type { CartLine } from '@/types/cart';

const REMOVE_FADE_MS = 180;

type CartLineItemProps = {
  line: CartLine;
};

export const CartLineItem = ({ line }: CartLineItemProps) => {
  const [removing, setRemoving] = useState(false);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const { product, item, variantLabel, unitPrice, lineTotal, maxQuantity } = line;
  const thumbnail = product.images?.[0];
  const stockState = getStockState(product, item.variant ?? {});
  const soldOut = maxQuantity <= 0;
  const removeLabel = `Remove ${product.name}${variantLabel ? `, ${variantLabel}` : ''}`;

  const onRemove = () => {
    setRemoving(true);
    timer.current = window.setTimeout(() => removeItem(line.key), REMOVE_FADE_MS);
  };

  return (
    <li
      className={cn(
        'grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-6 transition-opacity duration-200 sm:grid-cols-[6rem_1fr_auto] sm:gap-6',
        removing && 'opacity-0',
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-charcoal"
        tabIndex={-1}
        aria-hidden
      >
        {thumbnail ? (
          <Image src={thumbnail} alt="" fill sizes="96px" className="object-cover" />
        ) : null}
      </Link>

      <div className="min-w-0">
        <p className="font-mono text-[0.625rem] tracking-[0.2em] text-bronze uppercase">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`} className="alt-link mt-1.5 block text-base">
          {product.name}
        </Link>
        {variantLabel ? (
          <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
            {variantLabel}
          </p>
        ) : null}
        <p className="mt-2 font-mono text-sm text-muted">
          {formatIDR(unitPrice)} {item.quantity > 1 ? 'each' : ''}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={Math.max(1, maxQuantity)}
            onChange={(value) => setQuantity(line.key, value)}
            label="Quantity"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            className="self-end font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase underline underline-offset-4 transition-colors duration-300 hover:text-critical sm:mb-4"
          >
            Remove
          </button>
        </div>

        {soldOut ? (
          <StockLabel
            label={stockState.label}
            detail={stockState.detail}
            tone={stockState.tone}
            className="mt-3"
          />
        ) : null}
      </div>

      <p className="col-start-2 font-mono text-sm sm:col-start-3 sm:self-start sm:text-right">
        {formatIDR(lineTotal)}
      </p>
    </li>
  );
};