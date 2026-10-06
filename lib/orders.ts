/**
 * Order storage and creation. Orders are kept in localStorage: this store is a
 * demo, so nothing leaves the browser. Every read is defensive and falls back to
 * an empty list, so a broken value can never break a page render.
 */

import { getPaymentMethod } from '@/data/payment';
import { getDeliveryEstimate, getShippingCost, getShippingOption } from '@/data/shipping';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/lib/storage';
import type { CartLine } from '@/types/cart';
import type {
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethodId,
  ShippingMethodId,
} from '@/types/order';

/** Orders are demo data — cap the history so storage never grows without bound. */
const MAX_ORDERS = 50;

/** Same-tab notification so open order pages re-read after a write. */
const ORDERS_EVENT = 'altitude:orders';

export const readOrders = (): Order[] => readStorage<Order[]>(STORAGE_KEYS.orders, []);

export const writeOrders = (orders: Order[]): void => {
  writeStorage(STORAGE_KEYS.orders, orders.slice(0, MAX_ORDERS));

  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(ORDERS_EVENT));
  } catch {
    // Event constructor unavailable: pages still re-read on their next render.
  }
};

export const subscribeOrders = (listener: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener(ORDERS_EVENT, listener);
  // Keeps the demo honest if the same store is opened in two tabs.
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(ORDERS_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
};

/** JSON snapshot for `useSyncExternalStore`: a primitive stays reference-stable. */
export const getOrdersSnapshot = (): string => JSON.stringify(readOrders());

export const parseOrders = (snapshot: string): Order[] => {
  try {
    const parsed = JSON.parse(snapshot) as Order[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const findOrder = (id: string | undefined): Order | null => {
  if (!id) return null;
  return readOrders().find((order) => order.id === id) ?? null;
};

const randomDigits = (length: number): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

const orderIdStamp = (date: Date): string =>
  [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('');

/**
 * Readable order ID, e.g. "ALT-260105-483102". IDs already used are skipped:
 * `saveOrder` stores one entry per ID, so a repeat would silently replace an
 * earlier order in the history.
 */
export const createOrderId = (date = new Date(), taken: readonly string[] = []): string => {
  const stamp = orderIdStamp(date);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const id = `ALT-${stamp}-${randomDigits(6)}`;
    if (!taken.includes(id)) return id;
  }

  return `ALT-${stamp}-${randomDigits(6)}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
};

/**
 * A fictional payment handle shown after checkout. Nothing here maps to a real
 * account, bank or wallet — it only exists so the demo has something to display.
 */
const createPaymentReference = (method: PaymentMethodId): string => {
  switch (method) {
    case 'bank_transfer':
      return `TRX-${randomDigits(8)}`;
    case 'virtual_account':
      return `88${randomDigits(12)}`;
    case 'e_wallet':
      return `EWALLET-${randomDigits(8)}`;
    case 'qris':
      return `QRIS-${randomDigits(10)}`;
    case 'cod':
      return `COD-${randomDigits(6)}`;
  }
};

export type CreateOrderInput = {
  lines: CartLine[];
  customer: Customer;
  shippingId: ShippingMethodId;
  paymentId: PaymentMethodId;
  /** Overrides the clock, so a snapshot can be rebuilt deterministically. */
  now?: Date;
};

export const createOrder = ({
  lines,
  customer,
  shippingId,
  paymentId,
  now = new Date(),
}: CreateOrderInput): Order => {
  const shipping = getShippingOption(shippingId);
  const payment = getPaymentMethod(paymentId);
  const createdAt = now.toISOString();

  const items: OrderItem[] = lines.map((line) => ({
    productId: line.product.id,
    slug: line.product.slug,
    name: line.product.name,
    image: line.product.images[0] ?? '',
    price: line.unitPrice,
    quantity: line.item.quantity,
    variant: Object.keys(line.item.variant ?? {}).length ? line.item.variant : undefined,
    category: line.product.category,
  }));

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const shippingCost = getShippingCost(shipping, subtotal);

  return {
    id: createOrderId(now, readOrders().map((order) => order.id)),
    items,
    customer,
    shipping: {
      method: shipping.id,
      label: shipping.label,
      cost: shippingCost,
      estimate: shipping.estimate,
    },
    payment: {
      method: payment.id,
      label: payment.label,
      // Cash on delivery stays unpaid until the parcel arrives.
      status: payment.id === 'cod' ? 'unpaid' : 'paid',
      reference: createPaymentReference(payment.id),
      paidAt: payment.id === 'cod' ? undefined : createdAt,
    },
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    status: payment.id === 'cod' ? 'created' : 'paid',
    createdAt,
    estimatedDelivery: getDeliveryEstimate(shipping, now),
    tracking: payment.id === 'cod' ? { created: createdAt } : { created: createdAt, paid: createdAt },
  };
};

/** Stores the order as the newest entry and hands it back for the redirect. */
export const saveOrder = (order: Order): Order => {
  writeOrders([order, ...readOrders().filter((candidate) => candidate.id !== order.id)]);
  return order;
};

/** Moves the demo order one step forward, stamping the status it just entered. */
export const advanceOrder = (id: string): Order | null => {
  const orders = readOrders();
  const current = orders.find((order) => order.id === id);
  if (!current) return null;

  const flow = ['created', 'paid', 'processing', 'shipped', 'transit', 'delivered'] as const;
  const index = flow.indexOf(current.status);
  if (index < 0 || index >= flow.length - 1) return current;

  const status: OrderStatus = flow[index + 1];
  const at = new Date().toISOString();
  const isFinal = status === 'delivered';

  const updated: Order = {
    ...current,
    status,
    tracking: { ...current.tracking, [status]: at },
    // Delivering a cash-on-delivery parcel is when the money changes hands.
    payment:
      current.payment.status === 'unpaid' && isFinal
        ? { ...current.payment, status: 'paid', paidAt: at }
        : current.payment,
  };

  writeOrders(orders.map((order) => (order.id === id ? updated : order)));
  return updated;
};