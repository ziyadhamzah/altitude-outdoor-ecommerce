import type { ShippingOption } from '@/types/order';

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: 'regular',
    label: 'REGULAR',
    cost: 15000,
    estimate: '2–4 days',
    detail: 'Dispatched within 1 business day',
    etaDays: [2, 4],
  },
  {
    id: 'express',
    label: 'EXPRESS',
    cost: 30000,
    estimate: '1–2 days',
    detail: 'Priority handling, dispatched the same day',
    etaDays: [1, 2],
  },
  {
    id: 'sameday',
    label: 'SAME DAY',
    cost: 50000,
    estimate: 'Today',
    detail: 'Ordered before 12.00 for city delivery',
    etaDays: [0, 0],
  },
];

export const DEFAULT_SHIPPING_OPTION = SHIPPING_OPTIONS[0];

/** Orders above this value ship free, as promised on the product and info pages. */
export const FREE_SHIPPING_THRESHOLD = 1_500_000;

export const qualifiesForFreeShipping = (subtotal: number): boolean =>
  subtotal > FREE_SHIPPING_THRESHOLD;

/** Shipping actually charged for a cart: free above the threshold. */
export const getShippingCost = (option: ShippingOption, subtotal = 0): number =>
  qualifiesForFreeShipping(subtotal) ? 0 : option.cost;

export const getShippingOption = (id: string): ShippingOption =>
  SHIPPING_OPTIONS.find((option) => option.id === id) ?? DEFAULT_SHIPPING_OPTION;

const DAY_MS = 24 * 60 * 60 * 1000;

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(date);

/** Human readable delivery window, e.g. "18 – 20 Oct 2026". */
export const getDeliveryEstimate = (option: ShippingOption, from = new Date()): string => {
  const start = addDays(from, option.etaDays[0]);
  const end = addDays(from, option.etaDays[1]);
  const startLabel = formatShortDate(start);
  const endLabel = formatShortDate(end);
  return startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`;
};
