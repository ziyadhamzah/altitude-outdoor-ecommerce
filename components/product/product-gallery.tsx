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
        {images.map((image, index) => (
          <Image
            key={image}
            src={image}
            alt={index === active ? `${alt} — view ${index + 1}` : ''}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            aria-hidden={index !== active}
            className={cn(
              'object-cover transition-opacity duration-500 ease-altitude',
              index === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
      </div>

      {images.length > 1 ? (
        <div className="rail -mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show view ${index + 1} of ${images.length}`}
              aria-current={index === active}
              className={cn(
                'relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-charcoal transition-opacity duration-300 md:w-24',
                index === active ? 'opacity-100' : 'opacity-45 hover:opacity-80',
              )}
            >
              <Image src={image} alt="" fill sizes="96px" className="object-cover" />
              <span
                aria-hidden
                className={cn(
                  'absolute inset-x-0 bottom-0 h-0.5 transition-colors duration-300',
                  index === active ? 'bg-bronze' : 'bg-transparent',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};