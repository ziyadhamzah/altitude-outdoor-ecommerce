import { getProductById } from '@/data/products';
import type { CartItem, CartLine } from '@/types/cart';
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

/** Joins stored cart items with the catalog. Unknown products are dropped. */
export const getCartLines = (items: CartItem[]): CartLine[] =>
  items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];

    const selection = item.variant ?? {};
    const maxQuantity = getVariantStock(product, selection);

    return [
      {
        key: cartItemKey(item),
        item,
        product,
        variantLabel: formatVariantLabel(product, selection),
        unitPrice: product.price,
        lineTotal: product.price * item.quantity,
        maxQuantity,
      },
    ];
  });

export const getCartCount = (items: CartItem[]): number =>
  items.reduce((total, item) => total + item.quantity, 0);

export const getCartSubtotal = (lines: CartLine[]): number =>
  lines.reduce((total, line) => total + line.lineTotal, 0);
