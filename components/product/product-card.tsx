import Image from 'next/image';
import Link from 'next/link';

import { formatIDR } from '@/lib/format';
import { CATEGORY_LABELS, type Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  sizes?: string;
};

export const ProductCard = ({
  product,
  priority = false,
  sizes = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw',
}: ProductCardProps) => (
  <Link href={`/product/${product.slug}`} className="group block">
    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
      <Image
        src={product.images[0]}
        alt={`${product.name} — ${CATEGORY_LABELS[product.category]}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[900ms] ease-altitude group-hover:scale-[1.04]"
      />

      {product.stock === 0 ? (
        <span className="absolute left-4 top-4 bg-offwhite px-3 py-1.5 font-mono text-[0.5625rem] tracking-[0.2em] uppercase">
          Sold out
        </span>
      ) : null}

      <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-charcoal/85 py-3 text-center font-mono text-[0.625rem] tracking-[0.22em] text-offwhite uppercase transition-transform duration-500 ease-altitude group-hover:translate-y-0 group-focus-visible:translate-y-0">
        View product
      </span>
    </div>

    <div className="mt-5 flex items-start justify-between gap-4">
      <div>
        <p className="alt-eyebrow alt-eyebrow-bronze">{CATEGORY_LABELS[product.category]}</p>
        <h3 className="mt-2 text-lg leading-snug transition-opacity duration-300 group-hover:opacity-70">
          {product.name}
        </h3>
      </div>
      <p className="shrink-0 font-mono text-sm whitespace-nowrap">{formatIDR(product.price)}</p>
    </div>
  </Link>
);
