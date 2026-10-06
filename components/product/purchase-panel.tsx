'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { QuantitySelector } from '@/components/ui/quantity-selector';
import { StockLabel } from '@/components/ui/stock-label';
import {
  formatVariantLabel,
  getStockState,
  getVariantStock,
  isVariantSelectionComplete,
} from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import type { Product, VariantSelection } from '@/types/product';

const ADDED_RESET_MS = 2000;

type PurchasePanelProps = {
  product: Product;
};

type Feedback = { tone: 'added' | 'error'; message: string } | null;

const joinList = (items: string[]): string =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export const PurchasePanel = ({ product }: PurchasePanelProps) => {
  const [selection, setSelection] = useState<VariantSelection>({});
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const addItem = useCartStore((state) => state.addItem);
  const wishlistIds = useWishlistStore((state) => state.productIds);
  const toggleWishlist = useWishlistStore((state) => state.toggle);

  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const complete = isVariantSelectionComplete(product, selection);
  const stock = useMemo(() => getVariantStock(product, selection), [product, selection]);
  const stockState = getStockState(product, selection);
  const wished = wishlistIds.includes(product.id);
  const variantLabel = formatVariantLabel(product, selection);

  const requirements = (product.variants ?? []).map((variant) => `a ${variant.name.toLowerCase()}`);
  const selectionPrompt = `Please select ${joinList(requirements)}.`;

  const onAdd = () => {
    if (!complete) {
      setFeedback({ tone: 'error', message: selectionPrompt });
      return;
    }

    if (stock <= 0) {
      setFeedback({ tone: 'error', message: 'This piece is currently out of stock.' });
      return;
    }

    addItem({ productId: product.id, quantity, variant: selection });
    setFeedback({ tone: 'added', message: `${product.name} added to cart.` });

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFeedback(null), ADDED_RESET_MS);
  };

  const selectOption = (name: string, option: string) => {
    // Functional updates: two option clicks batched into one render must both
    // apply, so each step reads the queued selection instead of the snapshot.
    setSelection((current) => ({ ...current, [name]: option }));
    // Switching to a smaller size must not leave an unbuyable quantity selected.
    setQuantity((current) => Math.min(current, Math.max(1, getVariantStock(product, { ...selection, [name]: option }))));
    setFeedback(null);
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
              const unavailable = optionStock <= 0 && variant.name === 'Size';

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectOption(variant.name, option)}
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
          max={Math.max(1, stock)}
          onChange={(value) => {
            setQuantity(value);
            setFeedback(null);
          }}
        />
        <StockLabel
          label={stockState.label}
          detail={stockState.detail}
          tone={stockState.tone}
          className="pb-3.5"
        />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button type="button" onClick={onAdd} disabled={stock <= 0} className="btn btn-dark w-full">
          {stock <= 0 ? 'Out of stock' : feedback?.tone === 'added' ? 'Added' : 'Add to cart'}
        </button>

        <button type="button" onClick={() => toggleWishlist(product.id)} className="btn btn-outline w-full">
          {wished ? 'Remove from wishlist' : 'Add to wishlist'}
        </button>
      </div>

      <p
        aria-live="polite"
        className="mt-4 min-h-5 font-mono text-[0.6875rem] tracking-[0.16em] uppercase"
      >
        {feedback?.tone === 'added' ? (
          <span className="text-positive">{feedback.message}</span>
        ) : null}
        {feedback?.tone === 'error' ? (
          <span className="text-critical">{feedback.message}</span>
        ) : null}
        {!feedback && variantLabel ? (
          <span className="text-muted">
            {variantLabel}
            {quantity > 1 ? ` · ${quantity} units` : ''}
          </span>
        ) : null}
      </p>
    </div>
  );
};