/**
 * LocalStorage helpers. Every read is defensive: a missing key, disabled storage
 * (private mode) or malformed JSON falls back to the provided default instead
 * of throwing, so a broken value can never break a page render.
 */

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readStorage = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: state stays in memory for this session.
  }
};

export const removeStorage = (key: string): void => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // no-op
  }
};

export const STORAGE_KEYS = {
  cart: 'altitude.cart.v1',
  wishlist: 'altitude.wishlist.v1',
  orders: 'altitude.orders.v1',
  recentlyViewed: 'altitude.recently-viewed.v1',
} as const;
