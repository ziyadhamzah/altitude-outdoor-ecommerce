import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { SectionHeading } from '@/components/ui/section-heading';
import { CATEGORY_ENTRIES, categoryHref } from '@/data/categories';
import { getFeaturedProducts } from '@/data/products';
import { formatIDR } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'The ALTITUDE system: apparel, bags, footwear and accessories designed to work together on the same trip.',
};

export default function CollectionsPage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-charcoal text-offwhite">
        <Image
          src="/images/editorial/hero-05.jpg"
          alt="Sunrise light spilling over a coastal mountain summit"
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-charcoal/35" />
        <div className="alt-container w-full py-16 md:py-24">
          <p className="alt-eyebrow text-bronze">Collections</p>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.5rem,8vw,6rem)] leading-[0.88] tracking-[-0.04em] uppercase">
            One system. Every trail.
          </h1>
          <p className="mt-6 max-w-md text-sm text-offwhite/80">
            We build in systems, not seasons. Every layer, pack and boot is designed to work with the
            rest — so the decision you make in the shop is the decision that holds up on the mountain.
          </p>
        </div>
      </section>

      <section className="alt-container py-20 md:py-28">
        <SectionHeading
          eyebrow="The system"
          title="Four categories, one standard."
          description="Weight, weather and repairability decide what earns a place in the collection."
        />

        <div className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 md:grid-cols-2">
          {CATEGORY_ENTRIES.map((entry, index) => (
            <Link key={entry.slug} href={categoryHref(entry.slug)} className="group block">
              <div
                className={`relative overflow-hidden bg-charcoal ${
                  index % 2 === 1 ? 'aspect-[4/3] md:mt-16' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={entry.image}
                  alt={entry.alt}
                  fill
                  sizes="(min-width: 768px) 46vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-altitude group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="alt-eyebrow alt-eyebrow-bronze">{entry.index}</p>
                  <h2 className="mt-2 font-display text-2xl tracking-[-0.025em] uppercase">
                    {entry.label}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm text-muted">{entry.tagline}</p>
                </div>
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase transition-opacity group-hover:opacity-60">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-offwhite">
        <div className="alt-container py-20 md:py-28">
          <SectionHeading
            eyebrow="Start here"
            title="The pieces we would build a kit around."
            link={{ label: 'Shop all gear', href: '/shop' }}
          />
          <ul className="mt-12 border-t border-line md:mt-16">
            {featured.map((product, index) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  className="group flex items-baseline justify-between gap-6 border-b border-line py-5"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="font-mono text-[0.625rem] text-muted tabular-nums">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="font-display text-xl tracking-[-0.02em] uppercase transition-transform duration-500 ease-altitude group-hover:translate-x-2">
                      {product.name}
                    </span>
                  </span>
                  <span className="font-mono text-sm whitespace-nowrap">
                    {formatIDR(product.price)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
