'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { formatIDR } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';
import type { Order, PaymentMethodId } from '@/types/order';
import { PAYMENT_METHOD_LABELS } from '@/types/order';

const STEPS = ['CART', 'INFORMATION', 'SHIPPING', 'PAYMENT'] as const;

function readOrder(id: string | undefined | string[]): Order | null {
  if (!id || Array.isArray(id)) return null;
  try {
    const raw = localStorage.getItem('altitude-orders');
    if (!raw) return null;
    const list = JSON.parse(raw) as Order[];
    return list.find((o) => o.id === id) || null;
  } catch {
    return null;
  }
}

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const id = params?.id;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const o = readOrder(id);
    if (!o) {
      router.replace('/shop');
      return;
    }
    setOrder(o);
  }, [hydrated, id, router]);

  if (!hydrated) {
    return (
      <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">Loading order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
        <p className="alt-eyebrow alt-eyebrow-bronze">Order not found</p>
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">
          We couldn&apos;t find an order with this ID
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-dark">
            Back to shop
          </Link>
          <Link href="/" className="btn btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const pm = (order.payment?.method) as PaymentMethodId | undefined;

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Order confirmed</p>
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">Your order has been placed successfully</h1>
        <nav aria-label="Checkout steps" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-muted">
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              <span className={s === 'PAYMENT' ? 'text-ink' : ''}>{s}</span>
              {i < STEPS.length - 1 && <span aria-hidden>/</span>}
            </span>
          ))}
        </nav>
        <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.16em] uppercase text-muted">SIMULATED ORDER — NO REAL TRANSACTION</p>
        <div className="mt-6 flex flex-wrap items-baseline gap-4">
          <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase">ORDER ID</p>
          <p className="font-mono text-lg tracking-[0.18em] uppercase">{order.id}</p>
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 space-y-10">
          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Order items</h2>
            <ul className="mt-6 border-t border-line">
              {order.items.map((it, idx) => (
                <li key={idx} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[6rem_1fr_auto] sm:gap-6">
                  <div className="relative block aspect-[4/5] overflow-hidden bg-charcoal">
                    {it.image && <Image src={it.image} alt={it.name} fill sizes="96px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="mt-1.5 text-base">{it.name}</p>
                    {it.variant && Object.values(it.variant).some(Boolean) && (
                      <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                        {Object.entries(it.variant)
                          .filter(([, v]) => v)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' / ')}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-sm text-muted">
                      Qty {it.quantity} · {formatIDR(it.price)} each
                    </p>
                  </div>
                  <p className="col-start-2 font-mono text-sm sm:col-start-3 sm:self-start sm:text-right">{formatIDR(it.price * it.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Customer information</h2>
            <dl className="mt-6 border-t border-line">
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Full name</dt>
                <dd className="text-sm">{order.customer.fullName}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Phone number</dt>
                <dd className="text-sm">{order.customer.phone}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">City / region</dt>
                <dd className="text-sm">{order.customer.city}</dd>
              </div>
              <div className="flex flex-col gap-2 border-b border-line py-3 md:flex-row md:items-baseline md:justify-between">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Address</dt>
                <dd className="max-w-lg text-sm md:text-right">{order.customer.address}</dd>
              </div>
              {order.customer.note && (
                <div className="flex flex-col gap-2 border-b border-line py-3 md:flex-row md:items-baseline md:justify-between">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Order note</dt>
                  <dd className="max-w-lg text-sm md:text-right">{order.customer.note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Delivery & Payment</h2>
            <dl className="mt-6 border-t border-line">
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Shipping</dt>
                <dd className="text-sm">{order.shipping?.label} · {order.shipping?.estimate}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Shipping cost</dt>
                <dd className="font-mono text-sm">{formatIDR(order.shippingCost ?? order.shipping?.cost ?? 0)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Payment method</dt>
                <dd className="text-sm">{pm ? PAYMENT_METHOD_LABELS[pm] : ''}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Payment status</dt>
                <dd className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase text-positive">PAID</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Order status</dt>
                <dd className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase text-positive">PAID</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Order date</dt>
                <dd className="text-sm">{new Date(order.createdAt).toLocaleString('en-GB')}</dd>
              </div>
              {order.estimatedDelivery && (
                <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Estimated delivery</dt>
                  <dd className="text-sm">{order.estimatedDelivery}</dd>
                </div>
              )}
            </dl>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`/tracking/${order.id}`} className="btn btn-dark">
              Track order
            </Link>
            <Link href="/shop" className="btn btn-outline">
              Continue shopping
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to home
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-line bg-white p-6 lg:sticky lg:top-28">
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Order summary</h2>
            <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-mono">{formatIDR(order.subtotal)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-mono">{formatIDR(order.shippingCost ?? order.shipping?.cost ?? 0)}</dd>
              </div>
              <div className="rule my-5" />
              <div className="flex items-baseline justify-between gap-4">
                <dt className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">Total</dt>
                <dd className="font-mono text-lg">{formatIDR(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-6 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-muted">SIMULATED PAYMENT — NO REAL TRANSACTION</p>
          </div>
        </aside>
      </div>
    </div>
  );
}