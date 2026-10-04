'use client';

import Image from 'next/image';
import Link from 'next/link';

import { QuantitySelector } from '@/components/ui/quantity-selector';
import { formatIDR } from '@/lib/format';
import { useCartStore } from '@/store/cart';
import type { CartLine } from '@/types/cart';

type CartLineItemProps = {
  line: CartLine;
};

export const CartLineItem = ({ line }: CartLineItemProps) => {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[6rem_1fr_auto] sm:gap-6">
      <Link
        href={`/product/${line.product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-charcoal"
      >
        <Image src={line.product.images[0]} alt={line.product.name} fill sizes="96px" className="object-cover" />
      </Link>

      <div className="min-w-0">
        <p className="font-mono text-[0.625rem] tracking-[0.2em] text-bronze uppercase">
          {line.product.category}
        </p>
        <Link href={`/product/${line.product.slug}`} className="alt-link mt-1.5 block text-base">
          {line.product.name}
        </Link>
        {line.variantLabel ? (
          <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
            {line.variantLabel}
          </p>
        ) : null}
        <p className="mt-2 font-mono text-sm">{formatIDR(line.unitPrice)}</p>

        <div className="mt-4 flex items-center gap-5">
          <QuantitySelector
            size="sm"
            value={line.item.quantity}
            max={Math.max(1, line.maxQuantity)}
            onChange={(value) => setQuantity(line.key, value)}
            label="Qty"
          />
          <button
            type="button"
            onClick={() => removeItem(line.key)}
            className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase transition-colors duration-300 hover:text-critical"
          >
            Remove
          </button>
        </div>
      </div>

      <p className="col-start-2 font-mono text-sm sm:col-start-3 sm:self-start sm:text-right">
        {formatIDR(line.lineTotal)}
      </p>
    </li>
  );
};
