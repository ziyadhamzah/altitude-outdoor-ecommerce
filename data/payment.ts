import type { PaymentMethod } from '@/types/order';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank_transfer',
    label: 'BANK TRANSFER',
    detail: 'Transfer from any Indonesian bank app.',
    instructions:
      'A simulated transfer instruction is generated with your order. No real bank account is required for this demo.',
  },
  {
    id: 'virtual_account',
    label: 'VIRTUAL ACCOUNT',
    detail: 'Dedicated virtual account number per order.',
    instructions:
      'A simulated virtual account number is generated with your order. This demo never asks for bank credentials.',
  },
  {
    id: 'e_wallet',
    label: 'E-WALLET',
    detail: 'GoPay, OVO, DANA, ShopeePay.',
    instructions:
      'You would be redirected to your wallet app to confirm the payment. This step is simulated for the demo.',
  },
  {
    id: 'qris',
    label: 'QRIS',
    detail: 'Scan once with any QRIS-enabled app.',
    instructions:
      'A simulated QRIS confirmation screen is shown. No real QR code or payment provider is involved.',
  },
  {
    id: 'cod',
    label: 'CASH ON DELIVERY',
    detail: 'Pay the courier when the parcel arrives.',
    instructions:
      'The courier will collect the total in cash on delivery. The order is marked as paid when the parcel is delivered.',
  },
];

export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS[0];

export const getPaymentMethod = (id: string): PaymentMethod =>
  PAYMENT_METHODS.find((method) => method.id === id) ?? DEFAULT_PAYMENT_METHOD;
