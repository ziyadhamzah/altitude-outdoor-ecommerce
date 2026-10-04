'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/lib/storage';

type WishlistState = {
  productIds: string[];
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],

      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),

      remove: (productId) =>
        set((state) => ({ productIds: state.productIds.filter((id) => id !== productId) })),

      clear: () => set({ productIds: [] }),
    }),
    {
      name: STORAGE_KEYS.wishlist,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
      skipHydration: true,
    },
  ),
);
