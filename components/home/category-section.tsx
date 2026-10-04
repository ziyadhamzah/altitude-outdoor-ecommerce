import Image from 'next/image';
import Link from 'next/link';

import { CATEGORY_ENTRIES, categoryHref, getCategoryCount } from '@/data/categories';

export const CategorySection = () => (
  <section className="border-y border-line bg-offwhite">
    <div className="alt-container py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="alt-eyebrow alt-eyebrow-bronze">Shop by category</p>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.25rem)] leading-[0.95] tracking-[-0.03em] uppercase">
              Four systems,
              <br />
              one kit.
            </h2>
            <p className="mt-6 max-w-sm text-sm text-muted">
              Start with the layer that keeps you dry, the pack that carries the rest, and the
              footwear that holds the line. Everything else is detail.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {CATEGORY_ENTRIES.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={categoryHref(entry.slug)}
                  className="group grid grid-cols-[auto_1fr] items-center gap-5 border-b border-line py-6 md:grid-cols-[auto_1fr_auto] md:gap-8 md:py-8"
                >
                  <span className="font-mono text-[0.625rem] tracking-[0.2em] text-bronze">
                    {entry.index}
                  </span>

                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(1.5rem,3.5vw,2.5rem)] leading-none tracking-[-0.025em] uppercase transition-transform duration-500 ease-altitude group-hover:translate-x-2">
                      {entry.label}
                    </span>
                    <span className="mt-3 block text-sm text-muted">{entry.tagline}</span>
                  </span>

                  <span className="hidden items-center gap-6 md:flex">
                    <span className="font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase">
                      {getCategoryCount(entry.slug)} items
                    </span>
                    <span className="block h-16 w-24 overflow-hidden bg-charcoal">
                      <Image
                        src={entry.image}
                        alt={entry.alt}
                        width={96}
                        height={64}
                        className="h-full w-full object-cover transition-transform duration-700 ease-altitude group-hover:scale-105"
                      />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);
