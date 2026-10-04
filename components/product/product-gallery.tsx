'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/cn';

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export const ProductGallery = ({ images, alt }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt} — view ${active + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="hero-zoom object-cover"
        />
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show view ${index + 1}`}
              aria-current={index === active}
              className={cn(
                'relative aspect-[4/5] overflow-hidden bg-charcoal transition-opacity duration-300',
                index === active ? 'opacity-100' : 'opacity-45 hover:opacity-80',
              )}
            >
              <Image src={image} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
