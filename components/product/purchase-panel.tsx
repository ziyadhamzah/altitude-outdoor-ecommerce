'use client';

import { useMemo, useState } from 'react';

import { QuantitySelector } from '@/components/ui/quantity-selector';
import { StockLabel } from '@/components/ui/stock-label';
import { getVariantStock, getStockState, isVariantSelectionComplete } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import type { Product, VariantSelection } from '@/types/product';

type PurchasePanelProps = {
  product: Product;
};

export const PurchasePanel = ({ product }: PurchasePanelProps) => {
  const [selection, setSelection] = useState<VariantSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<'idle' | 'added' | 'needs-variant'>('idle');

  const addItem = useCartStore((state) => state.addItem);
  const wishlistIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const complete = isVariantSelectionComplete(product, selection);
  const stock = useMemo(() => getVariantStock(product, selection), [product, selection]);
  const stockState = getStockState(product, selection);
  const wished = wishlistIds.includes(product.id);

  const maxQuantity = Math.max(1, stock);

  const onAdd = () => {
    if (!complete) {
      setFeedback('needs-variant');
      return;
    }
    if (stock <= 0) return;
    addItem({ productId: product.id, quantity, variant: selection });
    setFeedback('added');
  };

  return (
    <div className="mt-10 border-t border-line pt-8">
      {product.variants?.map((variant) => (
        <fieldset key={variant.name} className="mb-8">
          <legend className="field-label">
            {variant.name}
            {selection[variant.name] ? (
              <span className="ml-2 text-ink">{selection[variant.name]}</span>
            ) : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variant.options.map((option) => {
              const isSelected = selection[variant.name] === option;
              const optionStock = getVariantStock(product, { [variant.name]: option });
              const unavailable = optionStock <= 0 && variant.name !== 'Size';

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelection((current) => ({ ...current, [variant.name]: option }));
                    setFeedback('idle');
                  }}
                  disabled={unavailable}
                  aria-pressed={isSelected}
                  className={cn(
                    'min-h-11 border px-4 font-mono text-[0.6875rem] tracking-[0.14em] uppercase transition-colors duration-300',
                    isSelected
                      ? 'border-ink bg-ink text-offwhite'
                      : 'border-line bg-white hover:border-ink',
                    unavailable && 'cursor-not-allowed opacity-35 hover:border-line',
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-wrap items-end gap-6">
        <QuantitySelector
          value={quantity}
          max={maxQuantity}
          onChange={(value) => {
            setQuantity(value);
            setFeedback('idle');
          }}
        />
        <StockLabel label={stockState.label} tone={stockState.tone} className="pb-3.5" />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={onAdd}
          disabled={stock <= 0}
          className="btn btn-dark w-full"
        >
          {stock <= 0 ? 'Out of stock' : 'Add to cart'}
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="btn btn-outline w-full"
        >
          {wished ? 'Remove from wishlist' : 'Add to wishlist'}
        </button>
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
        {feedback === 'added' ? (
          <span className="text-positive">Added to cart</span>
        ) : null}
        {feedback === 'needs-variant' ? (
          <span className="text-critical">Select {product.variants?.map((v) => v.name.toLowerCase()).join(' and ')} first</span>
        ) : null}
      </p>
    </div>
  );
};
