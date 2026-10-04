import { getProductById } from '@/data/products';
import type { CartEntry, CartItem, CartLine } from '@/types/cart';
import { formatVariantLabel, getVariantStock } from './catalog';

type CartIdentity = Pick<CartItem, 'productId' | 'variant'>;

/** Stable identity for a cart line: same product + same variant selection. */
export const cartItemKey = ({ productId, variant }: CartIdentity): string => {
  const selection = variant ?? {};
  const variantKey = Object.keys(selection)
    .sort()
    .map((name) => `${name}:${selection[name]}`)
    .join('|');
  return `${productId}::${variantKey}`;
};

/**
 * Joins stored cart items with the catalog. Items whose product disappeared are
 * kept as `unavailable` entries so the cart can show them instead of crashing.
 */
export const getCartEntries = (items: CartItem[]): CartEntry[] =>
  items.map((item) => {
    const key = cartItemKey(item);
    const product = getProductById(item.productId);

    if (!product) {
      return { kind: 'unavailable', key, item };
    }

    const selection = item.variant ?? {};

    return {
      kind: 'available',
      key,
      item,
      product,
      variantLabel: formatVariantLabel(product, selection),
      unitPrice: product.price,
      lineTotal: product.price * item.quantity,
      maxQuantity: getVariantStock(product, selection),
    };
  });

export const getAvailableLines = (entries: CartEntry[]): CartLine[] =>
  entries.flatMap((entry) => (entry.kind === 'available' ? [entry] : []));

/** Total units in the cart, ignoring items whose product is gone. */
export const getCartCount = (items: CartItem[]): number =>
  items.reduce(
    (total, item) => (getProductById(item.productId) ? total + item.quantity : total),
    0,
  );

export const getCartSubtotal = (lines: CartLine[]): number =>
  lines.reduce((total, line) => total + line.lineTotal, 0);