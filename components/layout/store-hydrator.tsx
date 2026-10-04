'use client';

import { useEffect } from 'react';

import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';

/** Rehydrates persisted stores once on the client. */
export const StoreHydrator = () => {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
  }, []);

  return null;
};
