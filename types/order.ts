import type { VariantSelection } from './product';

export type ShippingMethodId = 'regular' | 'express' | 'sameday';

export const PAYMENT_METHODS = [
  'bank_transfer',
  'virtual_account',
  'e_wallet',
  'qris',
  'cod',
] as const;

export type PaymentMethodId = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodId, string> = {
  bank_transfer: 'Bank Transfer',
  virtual_account: 'Virtual Account',
  e_wallet: 'E-Wallet',
  qris: 'QRIS',
  cod: 'Cash on Delivery',
};

export type OrderStatus =
  | 'created'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'transit'
  | 'delivered';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed';

export type Customer = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
};

export type ShippingOption = {
  id: ShippingMethodId;
  label: string;
  cost: number;
  estimate: string;
  detail: string;
  etaDays: [number, number];
};

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  detail: string;
  instructions: string;
};

export type OrderShipping = {
  method: ShippingMethodId;
  label: string;
  cost: number;
  estimate: string;
};

export type OrderPayment = {
  method: PaymentMethodId;
  label: string;
  status: PaymentStatus;
  reference: string;
  paidAt?: string;
};

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: VariantSelection;
  category?: string;
};

/** ISO timestamps per status, filled in as the demo order progresses. */
export type OrderTracking = Partial<Record<OrderStatus, string>>;

export type Order = {
  id: string;
  items: OrderItem[];
  customer: Customer;
  shipping: OrderShipping;
  payment: OrderPayment;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  tracking: OrderTracking;
};

export const ORDER_STATUS_FLOW: { status: OrderStatus; label: string; detail: string }[] = [
  { status: 'created', label: 'ORDER CREATED', detail: 'We received your order.' },
  { status: 'paid', label: 'PAYMENT SUCCESSFUL', detail: 'Payment simulation completed.' },
  { status: 'processing', label: 'PROCESSING', detail: 'Picking and packing at our warehouse.' },
  { status: 'shipped', label: 'HANDED TO COURIER', detail: 'Parcel collected by the courier.' },
  { status: 'transit', label: 'IN TRANSIT', detail: 'Moving through the delivery network.' },
  { status: 'delivered', label: 'DELIVERED', detail: 'Parcel delivered to the recipient.' },
];
