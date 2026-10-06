'use client';

import { useMemo, useSyncExternalStore } from 'react';

import { getOrdersSnapshot, parseOrders, subscribeOrders } from '@/lib/orders';
import { useHydrated } from '@/lib/use-hydrated';
import type { Order } from '@/types/order';

const getServerSnapshot = (): null => null;

type OrderLookup = {
  order: Order | null;
  hydrated: boolean;
};

/**
 * Reads one order from localStorage and re-renders when it changes, so the
 * tracking demo can advance an order without owning any state.
 */
export const useOrder = (id: string | undefined): OrderLookup => {
  const hydrated = useHydrated();
  const snapshot = useSyncExternalStore(subscribeOrders, getOrdersSnapshot, getServerSnapshot);

  const order = useMemo(() => {
    if (!hydrated || !id || !snapshot) return null;
    return parseOrders(snapshot).find((candidate) => candidate.id === id) ?? null;
  }, [hydrated, id, snapshot]);

  return { order, hydrated };
};