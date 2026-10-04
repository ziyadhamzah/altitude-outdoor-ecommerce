'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { formatIDR } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';
import type { Order, OrderStatus } from '@/types/order';

const ORDER_STATUSES: OrderStatus[] = ['created', 'paid', 'processing', 'shipped', 'transit', 'delivered'];

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  created: 'ORDER CREATED',
  paid: 'PAYMENT CONFIRMED',
  processing: 'PROCESSING',
  shipped: 'HANDED TO COURIER',
  transit: 'IN TRANSIT',
  delivered: 'DELIVERED',
};

const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  created: 'Your order has been created.',
  paid: 'Payment has been confirmed.',
  processing: 'Your order is being prepared.',
  shipped: 'Your order has been handed to the courier.',
  transit: 'Your order is in transit.',
  delivered: 'Your order has been delivered.',
};

function getStatusIndex(s: OrderStatus | undefined) {
  if (!s) return -1;
  return ORDER_STATUSES.indexOf(s);
}

function nextStatus(s: OrderStatus): OrderStatus {
  const i = ORDER_STATUSES.indexOf(s);
  if (i < 0) return 'paid';
  if (i >= ORDER_STATUSES.length - 1) return s;
  return ORDER_STATUSES[i + 1];
}

function readOrders(): Order[] {
  try {
    const raw = localStorage.getItem('altitude-orders');
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

function writeOrders(list: Order[]) {
  localStorage.setItem('altitude-orders', JSON.stringify(list.slice(0, 50)));
}

export default function TrackingPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const id = params?.id;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const list = readOrders();
    const o = id && !Array.isArray(id) ? list.find((x) => x.id === id) || null : null;
    if (!o) {
      router.replace('/shop');
      return;
    }
    setOrder(o);
  }, [hydrated, id, router]);

  function advanceStatus() {
    if (!order) return;
    const ns = nextStatus(order.status);
    if (ns === order.status) return;
    const now = new Date().toISOString();
    const list = readOrders();
    const nextList = list.map((o) => {
      if (o.id !== order.id) return o;
      const t: any = (o as any).tracking || {};
      if (ns === 'processing' && !t.processingAt) t.processingAt = now;
      if (ns === 'shipped' && !t.shippedAt) t.shippedAt = now;
      if (ns === 'transit' && !t.transitAt) t.transitAt = now;
      if (ns === 'delivered' && !t.deliveredAt) t.deliveredAt = now;
      if (ns === 'paid' && !t.paidAt && !(o as any).payment?.paidAt) t.paidAt = (o as any).payment?.paidAt || now;
      return { ...o, status: ns, tracking: t };
    });
    writeOrders(nextList);
    const updated = nextList.find((o) => o.id === order.id) || null;
    setOrder(updated);
  }

  if (!hydrated) {
    return (
      <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">Loading tracking…</p>
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
          <Link href="/shop" className="btn btn-dark">Back to shop</Link>
          <Link href="/" className="btn btn-outline">Back to home</Link>
        </div>
      </div>
    );
  }

  const current = order.status;
  const idx = getStatusIndex(current);
  const canAdvance = idx < ORDER_STATUSES.length - 1;
  const tracking: any = (order as any).tracking || {};

  function ts(key: string) {
    const v = tracking[key];
    if (v) return new Date(v).toLocaleString('en-GB');
    return null;
  }

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Track order</p>
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">Track your journey from checkout to delivery</h1>
        <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.16em] uppercase text-muted">SIMULATED TRACKING — NO REAL SHIPMENT OR COURIER CONNECTION</p>
        <div className="mt-6 flex flex-wrap items-baseline gap-4">
          <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase">ORDER ID</p>
          <p className="font-mono text-lg tracking-[0.18em] uppercase">{order.id}</p>
        </div>
        <div className="mt-8 max-w-xl border border-line bg-white p-6">
          <p className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Current status</p>
          <p className="mt-3 text-xl">{ORDER_STATUS_LABELS[current]}</p>
          <p className="mt-2 text-sm text-muted">{ORDER_STATUS_DESCRIPTIONS[current]}</p>
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7 space-y-10">
          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Tracking timeline</h2>
            <ol className="mt-6 space-y-6 border-l border-line pl-6">
              {ORDER_STATUSES.map((s, i) => {
                const state = i < idx ? 'completed' : i === idx ? 'current' : 'upcoming';
                return (
                  <li key={s} className="relative">
                    <span className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full border border-line ${state === 'completed' || state === 'current' ? 'bg-ink' : 'bg-white'}`} aria-hidden />
                    <p className={`font-mono text-[0.6875rem] tracking-[0.2em] uppercase ${state === 'current' ? 'text-ink' : state === 'completed' ? 'text-ink' : 'text-muted'}`}>{ORDER_STATUS_LABELS[s]}</p>
                    <p className="mt-1 text-sm text-muted">{ORDER_STATUS_DESCRIPTIONS[s]}</p>
                    {state === 'completed' && (
                      <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase text-muted">
                        {s === 'created' && (ts('createdAt') || new Date(order.createdAt).toLocaleString('en-GB'))}
                        {s === 'paid' && (ts('paidAt') || ts('createdAt') || new Date(order.createdAt).toLocaleString('en-GB'))}
                        {s === 'processing' && ts('processingAt')}
                        {s === 'shipped' && ts('shippedAt')}
                        {s === 'transit' && ts('transitAt')}
                        {s === 'delivered' && ts('deliveredAt')}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Demo control</h2>
            <div className="mt-4 border border-line bg-white p-5">
              <p className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">Simulate next status</p>
              <p className="mt-2 text-sm text-muted">This is a simulated delivery progression for demonstration purposes.</p>
              <button type="button" onClick={advanceStatus} disabled={!canAdvance} className="btn btn-dark mt-4">
                {canAdvance ? 'Simulate next status' : 'Order delivered'}
              </button>
              {!canAdvance && <p className="mt-3 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-muted">ORDER DELIVERED</p>}
            </div>
          </section>

          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Delivery</h2>
            <dl className="mt-6 border-t border-line">
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Shipping</dt>
                <dd className="text-sm">{order.shipping?.label} · {order.shipping?.estimate}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Shipping cost</dt>
                <dd className="font-mono text-sm">{formatIDR(order.shippingCost ?? order.shipping?.cost ?? 0)}</dd>
              </div>
              {order.estimatedDelivery && (
                <div className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                  <dt className="font-mono text-[0.6875rem] tracking-[0.16em] text-muted uppercase">Estimated delivery</dt>
                  <dd className="text-sm">{order.estimatedDelivery}</dd>
                </div>
              )}
            </dl>
          </section>

          <section>
            <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">Deliver to</h2>
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
            </dl>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`/order/${order.id}`} className="btn btn-outline">Back to order</Link>
            <Link href="/shop" className="btn btn-dark">Continue shopping</Link>
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
            <p className="mt-6 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-muted">SIMULATED TRACKING — NO REAL SHIPMENT OR COURIER CONNECTION</p>
          </div>
        </aside>
      </div>
    </div>
  );
}