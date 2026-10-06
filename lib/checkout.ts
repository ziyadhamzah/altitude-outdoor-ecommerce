import { getPaymentMethod } from '@/data/payment';
import { DEFAULT_SHIPPING_OPTION, getShippingOption } from '@/data/shipping';
import { readStorage, removeStorage, STORAGE_KEYS, writeStorage } from '@/lib/storage';
import type { Customer, PaymentMethodId, ShippingMethodId } from '@/types/order';

export type CustomerField = keyof Customer;

export type CustomerDraft = Record<CustomerField, string>;

export type CustomerErrors = Partial<Record<CustomerField, string>>;

export const EMPTY_CUSTOMER: CustomerDraft = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  note: '',
};

/** Digits only, so a copied "+62 812-3456" still validates. */
const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export const validateCustomer = (draft: CustomerDraft): CustomerErrors => {
  const errors: CustomerErrors = {};

  if (draft.fullName.trim().length < 2) {
    errors.fullName = 'Enter the recipient name.';
  }

  const phoneDigits = digitsOnly(draft.phone);
  if (phoneDigits.length < 9 || phoneDigits.length > 15) {
    errors.phone = 'Enter a phone number with 9–15 digits.';
  }

  if (draft.address.trim().length < 6) {
    errors.address = 'Enter the full street address.';
  }

  if (draft.city.trim().length < 2) {
    errors.city = 'Enter the city or region.';
  }

  return errors;
};

export const hasErrors = (errors: CustomerErrors): boolean => Object.keys(errors).length > 0;

/** Customer details as stored on the order — empty optional fields are dropped. */
export const toCustomer = (draft: CustomerDraft): Customer => ({
  fullName: draft.fullName.trim(),
  phone: draft.phone.trim(),
  address: draft.address.trim(),
  city: draft.city.trim(),
  note: draft.note.trim() ? draft.note.trim() : undefined,
});

/** Steps the customer can return to; CART is only a progress marker. */
export const CHECKOUT_STEPS = ['CART', 'INFORMATION', 'SHIPPING', 'PAYMENT'] as const;

export type CheckoutStepId = (typeof CHECKOUT_STEPS)[number];

export type CheckoutStep = Exclude<CheckoutStepId, 'CART'>;

/** Everything the customer has entered so far, restored after a refresh. */
export type CheckoutDraft = {
  step: CheckoutStep;
  customer: CustomerDraft;
  shippingId: ShippingMethodId;
  paymentId: PaymentMethodId;
};

const RESTORABLE_STEPS: CheckoutStep[] = ['INFORMATION', 'SHIPPING', 'PAYMENT'];

const isRestorableStep = (value: unknown): value is CheckoutStep =>
  typeof value === 'string' && RESTORABLE_STEPS.includes(value as CheckoutStep);

const sanitizeCustomer = (value: unknown): CustomerDraft => {
  const source = (value ?? {}) as Partial<Record<CustomerField, unknown>>;
  const draft: CustomerDraft = { ...EMPTY_CUSTOMER };

  for (const field of Object.keys(EMPTY_CUSTOMER) as CustomerField[]) {
    const entry = source[field];
    if (typeof entry === 'string') draft[field] = entry;
  }

  return draft;
};

/**
 * Checkout progress is kept in localStorage so a refresh (or a step back from
 * the browser history) never wipes what the customer already typed. Every field
 * is re-validated on read, so a stale or hand-edited value cannot break the page.
 */
export const readCheckoutDraft = (): CheckoutDraft => {
  const stored = readStorage<Partial<CheckoutDraft>>(STORAGE_KEYS.checkout, {});

  return {
    step: isRestorableStep(stored?.step) ? stored.step : 'INFORMATION',
    customer: sanitizeCustomer(stored?.customer),
    shippingId: getShippingOption(stored?.shippingId ?? DEFAULT_SHIPPING_OPTION.id).id,
    paymentId: getPaymentMethod(stored?.paymentId ?? '').id,
  };
};

export const writeCheckoutDraft = (draft: CheckoutDraft): void =>
  writeStorage(STORAGE_KEYS.checkout, draft);

/** Called once the order exists, so the next checkout starts clean. */
export const clearCheckoutDraft = (): void => removeStorage(STORAGE_KEYS.checkout);