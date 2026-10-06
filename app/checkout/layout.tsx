import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Delivery details, shipping options and a simulated payment for your order.',
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}