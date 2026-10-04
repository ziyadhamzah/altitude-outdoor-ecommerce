import Image from 'next/image';
import Link from 'next/link';

import { getNewArrivals } from '@/data/products';
import { formatIDR } from '@/lib/format';
import { CATEGORY_LABELS } from '@/types/product';
import { SectionHeading } from '@/components/ui/section-heading';

const pad = (value: number) => value.toString().padStart(2, '0');

export const NewArrivals = () => {
  const arrivals = getNewArrivals(4);

  return (
    <section className="alt-container py-20 md:py-28">
      <SectionHeading
        eyebrow="New arrivals"
        title="The latest gear from ALTITUDE."
        description="Fresh from the workshop floor, tested on the trails we actually walk."
        link={{ label: 'Shop new arrivals', href: '/shop?sort=newest' }}
      />

      <ul className="mt-12 border-t border-line md:mt-16">
        {arrivals.map((product, index) => (
          <li key={product.id}>
            <Link
              href={`/product/${product.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-5 md:grid-cols-[3rem_5rem_1fr_14rem_7rem] md:gap-8 md:py-6"
            >
              <span className="font-mono text-[0.625rem] tracking-[0.18em] text-muted tabular-nums">
                {pad(index + 1)}
              </span>

              <span className="relative hidden h-20 w-16 overflow-hidden bg-charcoal md:block">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover transition-transform duration-700 ease-altitude group-hover:scale-105"
                />
              </span>

              <span className="min-w-0">
                <span className="block font-mono text-[0.625rem] tracking-[0.2em] text-bronze uppercase">
                  {CATEGORY_LABELS[product.category]}
                </span>
                <span className="mt-1.5 block text-lg leading-snug transition-opacity duration-300 group-hover:opacity-70">
                  {product.name}
                </span>
                <span className="mt-1 block truncate text-xs text-muted md:hidden">
                  {product.material}
                </span>
              </span>

              <span className="hidden font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase md:block">
                {product.material.split(',')[0]}
              </span>

              <span className="text-right font-mono text-sm whitespace-nowrap md:text-right">
                {formatIDR(product.price)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
