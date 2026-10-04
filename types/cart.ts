import type { Product, VariantSelection } from './product';

export type CartItem = {
  productId: string;
  quantity: number;
  variant?: VariantSelection;
};

/** A cart item joined with its catalog product, used for rendering and totals. */
export type CartLine = {
  key: string;
  item: CartItem;
  product: Product;
  variantLabel: string;
  unitPrice: number;
  lineTotal: number;
  maxQuantity: number;
};

/** A stored item whose product is no longer in the catalog. */
export type UnavailableCartItem = {
  key: string;
  item: CartItem;
};

export type CartEntry =
  | ({ kind: 'available' } & CartLine)
  | ({ kind: 'unavailable' } & UnavailableCartItem);
