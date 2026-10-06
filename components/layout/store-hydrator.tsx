'use client';

import { useEffect } from 'react';

import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';

/** Rehydrates persisted stores once on the client, then re-checks stock limits. */
export const StoreHydrator = () => {
  useEffect(() => {
    let cancelled = false;

    // `rehydrate` is async, so clamping has to wait for the stored cart to land.
    void Promise.all([
      useCartStore.persist.rehydrate(),
      useWishlistStore.persist.rehydrate(),
    ]).then(() => {
      if (!cancelled) useCartStore.getState().clampToStock();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
};
