'use client';

import { useMemo, useSyncExternalStore } from 'react';

import { getOrdersSnapshot, parseOrders, subscribeOrders } from '@/lib/orders';
import { useHydrated } from '@/lib/use-hydrated';
import type { Order } from '@/types/order';

const getServerSnapshot = (): null => null;

type OrderHistory = {
  orders: Order[];
  hydrated: boolean;
};

/**
 * Reads every stored order and re-renders when the list changes, so the history
 * page stays in sync with checkout writes and tracking demos in other tabs.
 */
export const useOrders = (): OrderHistory => {
  const hydrated = useHydrated();
  const snapshot = useSyncExternalStore(subscribeOrders, getOrdersSnapshot, getServerSnapshot);

  const orders = useMemo(() => {
    if (!hydrated || !snapshot) return [];
    return parseOrders(snapshot).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [hydrated, snapshot]);

  return { orders, hydrated };
};
