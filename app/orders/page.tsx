'use client';

import Image from 'next/image';
import Link from 'next/link';

import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/cn';
import { formatDateTime, formatIDR } from '@/lib/format';
import { useOrders } from '@/lib/use-orders';
import type { Order, OrderStatus } from '@/types/order';
import { ORDER_STATUS_FLOW } from '@/types/order';

const statusLabel = (status: OrderStatus): string =>
  ORDER_STATUS_FLOW.find((step) => step.status === status)?.label ?? status.toUpperCase();

const isDelivered = (order: Order): boolean => order.status === 'delivered';

/** A short "3 items" style count for the list preview. */
const itemCount = (order: Order): string => {
  const total = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return `${total} ${total === 1 ? 'item' : 'items'}`;
};

const itemNames = (order: Order): string => {
  const firstName = order.items[0]?.name ?? 'Order';
  const rest = order.items.length - 1;
  return rest > 0 ? `${firstName} +${rest} more` : firstName;
};

export default function OrdersPage() {
  const { orders, hydrated } = useOrders();

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Order history</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
              Orders
            </h1>
            <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.24em] uppercase">
              Every simulated order placed from this browser.
            </p>
          </div>
          {hydrated && orders.length > 0 ? (
            <p className="font-mono text-[0.6875rem] tracking-[0.24em] uppercase md:text-right">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </p>
          ) : null}
        </div>
      </header>

      {!hydrated ? (
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          Loading orders…
        </p>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[45svh] flex-col justify-center py-16">
          <EmptyState
            eyebrow="No orders yet"
            title="Your order history is empty"
            description="Orders you place stay in this browser, so they will appear here after your first checkout."
            action={{ label: 'Explore the shop', href: '/shop' }}
          />
        </div>
      ) : (
        <ul className="mt-12 border-t border-line">
          {orders.map((order) => {
            const cover = order.items[0]?.image ?? '';
            const delivered = isDelivered(order);

            return (
              <li key={order.id} className="border-b border-line py-8">
                <div className="grid gap-6 sm:grid-cols-[6rem_1fr] sm:gap-8">
                  <div className="relative block aspect-[4/5] overflow-hidden bg-charcoal">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={order.items[0]?.name ?? 'Order'}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <p className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
                        {order.id}
                      </p>
                      <p
                        className={cn(
                          'font-mono text-[0.625rem] tracking-[0.18em] uppercase',
                          delivered ? 'text-positive' : 'text-bronze',
                        )}
                      >
                        {statusLabel(order.status)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm">{itemNames(order)}</p>
                    <p className="mt-2 font-mono text-[0.6875rem] tracking-[0.12em] text-muted uppercase">
                      {itemCount(order)} · {formatDateTime(order.createdAt)}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                      <p className="font-mono text-sm">{formatIDR(order.total)}</p>
                      <div className="flex flex-wrap gap-5">
                        <Link
                          href={`/order/${order.id}`}
                          className="font-mono text-[0.625rem] tracking-[0.2em] uppercase underline underline-offset-4 transition-colors duration-300 hover:text-ink"
                        >
                          View order
                        </Link>
                        <Link
                          href={`/tracking/${order.id}`}
                          className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase underline underline-offset-4 transition-colors duration-300 hover:text-ink"
                        >
                          Track
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
