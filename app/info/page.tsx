import type { Metadata } from 'next';
import Link from 'next/link';

import { SectionHeading } from '@/components/ui/section-heading';
import { BRAND } from '@/data/site';
import { SHIPPING_OPTIONS } from '@/data/shipping';
import { formatIDR } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Shipping, returns & contact',
  description:
    'Shipping rates and delivery estimates, return policy, and how to reach the ALTITUDE workshop.',
};

const RETURNS = [
  {
    title: '30 days to change your mind',
    body: 'Unused gear in its original packaging can be returned within 30 days of delivery. Start the return from your order confirmation email and we will send a courier pickup.',
  },
  {
    title: 'Free size exchange',
    body: 'Wrong size is the most common reason for a return. Exchanges ship free in both directions, subject to stock of the requested size.',
  },
  {
    title: 'Faulty gear',
    body: 'If a seam fails or hardware breaks in normal use, send us photographs of the fault. We will repair or replace the item, and cover the return shipping.',
  },
];

const CONTACT = [
  { label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
  { label: 'Phone', value: BRAND.phone, href: `tel:${BRAND.phone.replace(/[^+\d]/g, '')}` },
  { label: 'Workshop', value: BRAND.address },
];

export default function InfoPage() {
  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <SectionHeading
        as="h1"
        eyebrow="Customer care"
        title="Shipping, returns & contact."
        description="Everything about how your order travels, and how to reach a human at the workshop."
      />

      <section id="shipping" className="mt-14 scroll-mt-28 border-t border-line pt-10 md:mt-20">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] uppercase">
          Shipping
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          Orders are packed in Bandung and handed to the courier within one business day. Rates below
          apply nationwide and are calculated automatically at checkout.
        </p>

        <ul className="mt-10 border-t border-line">
          {SHIPPING_OPTIONS.map((option) => (
            <li
              key={option.id}
              className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr_8rem] sm:items-baseline sm:gap-6"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase">
                {option.label}
              </span>
              <span className="text-sm text-muted">{option.detail}</span>
              <span className="font-mono text-sm sm:text-right">{formatIDR(option.cost)}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted">
          Free shipping applies to orders above Rp1.500.000. Orders above Rp5.000.000 also include free
          exchanges.
        </p>
      </section>

      <section id="returns" className="mt-16 scroll-mt-28 border-t border-line pt-10 md:mt-24">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] uppercase">
          Returns & exchanges
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-3">
          {RETURNS.map((item) => (
            <div key={item.title}>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="mt-16 scroll-mt-28 border-t border-line pt-10 md:mt-24">
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] tracking-[-0.03em] uppercase">
          Contact
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          The workshop answers messages within one business day, Monday to Saturday.
        </p>

        <dl className="mt-10 border-t border-line">
          {CONTACT.map((item) => (
            <div
              key={item.label}
              className="grid gap-2 border-b border-line py-5 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted uppercase">
                {item.label}
              </dt>
              <dd className="text-sm">
                {item.href ? (
                  <a href={item.href} className="alt-link">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 text-sm text-muted">
          Looking for gear?{' '}
          <Link href="/shop" className="alt-link">
            Browse the collection
          </Link>
          .
        </p>
      </section>
    </div>
  );
}