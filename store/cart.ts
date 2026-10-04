'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getProductById } from '@/data/products';
import { getVariantStock } from '@/lib/catalog';
import { cartItemKey } from '@/lib/cart';
import { STORAGE_KEYS } from '@/lib/storage';
import type { CartItem } from '@/types/cart';

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  clampToStock: () => void;
};

const maxQuantityFor = (item: CartItem): number => {
  const product = getProductById(item.productId);
  if (!product) return 0;
  return getVariantStock(product, item.variant ?? {});
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = cartItemKey(item);
          const max = maxQuantityFor(item);
          if (max <= 0) return state;

          const existing = state.items.find((candidate) => cartItemKey(candidate) === key);

          if (existing) {
            const quantity = Math.min(existing.quantity + item.quantity, max);
            return {
              items: state.items.map((candidate) =>
                cartItemKey(candidate) === key ? { ...candidate, quantity } : candidate,
              ),
            };
          }

          return { items: [...state.items, { ...item, quantity: Math.min(item.quantity, max) }] };
        }),

      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.flatMap((candidate) => {
            if (cartItemKey(candidate) !== key) return [candidate];

            const max = maxQuantityFor(candidate);
            // Stock ran out for this variant: drop the line instead of keeping an
            // unbuyable quantity in the cart.
            if (max <= 0) return [];

            return [{ ...candidate, quantity: Math.max(1, Math.min(quantity, max)) }];
          }),
        })),

      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((candidate) => cartItemKey(candidate) !== key),
        })),

      clear: () => set({ items: [] }),

      /** Safety net for quantities stored before a stock change. */
      clampToStock: () =>
        set((state) => {
          const items = state.items.flatMap((candidate) => {
            const max = maxQuantityFor(candidate);
            if (max <= 0) return [];
            if (candidate.quantity <= max) return [candidate];
            return [{ ...candidate, quantity: max }];
          });

          const unchanged =
            items.length === state.items.length &&
            items.every((candidate, index) => candidate.quantity === state.items[index].quantity);

          return unchanged ? state : { items };
        }),
    }),
    {
      name: STORAGE_KEYS.cart,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);
