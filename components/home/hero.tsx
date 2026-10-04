'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { HERO_INTERVAL_MS, HERO_SLIDES } from '@/data/hero';
import { cn } from '@/lib/cn';
import { usePrefersReducedMotion } from '@/lib/use-reduced-motion';

const pad = (value: number) => value.toString().padStart(2, '0');

const CONTROL =
  'font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-100 opacity-70';

export const Hero = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);

  const total = HERO_SLIDES.length;
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (paused || reducedMotion || !visible) return;
    const timer = window.setTimeout(() => goTo(index + 1), HERO_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reducedMotion, visible, goTo]);

  const showProgress = !paused && !reducedMotion && visible;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="ALTITUDE highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-charcoal text-offwhite"
    >
      <div className="absolute inset-0 -z-10">
        {HERO_SLIDES.map((item, slideIndex) => (
          <div
            key={item.index}
            aria-hidden={slideIndex !== index}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-altitude',
              slideIndex === index ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={slideIndex === 0}
              sizes="100vw"
              className={cn('object-cover', slideIndex === index && 'hero-zoom')}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-charcoal/45" />
      </div>

      <div className="alt-container w-full pt-28 pb-14 md:pt-32 md:pb-20">
        <div className="max-w-3xl">
          <div key={slide.index} className="hero-copy">
            <p className="font-mono text-[0.6875rem] tracking-[0.3em] text-bronze uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="mt-6 text-[clamp(2.75rem,9vw,7rem)] leading-[0.88] tracking-[-0.04em] uppercase">
              {slide.headline}
            </h1>
            <p className="mt-6 max-w-md text-sm text-offwhite/80 md:text-base">
              {slide.description}
            </p>
            <Link href={slide.cta.href} className="btn btn-light mt-8 md:mt-10">
              {slide.cta.label}
            </Link>
          </div>
        </div>

        <div className="mt-14 flex items-end justify-between gap-6 border-t border-offwhite/20 pt-6 md:mt-20">
          <div className="flex items-center gap-5 md:gap-7">
            <button type="button" onClick={() => goTo(index - 1)} className={CONTROL}>
              Prev
            </button>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] tabular-nums">
              {pad(index + 1)} / {pad(total)}
            </span>
            <button type="button" onClick={() => goTo(index + 1)} className={CONTROL}>
              Next
            </button>
          </div>
          <p className="hidden font-mono text-[0.625rem] tracking-[0.22em] text-offwhite/45 uppercase md:block">
            {slide.eyebrow}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-offwhite/15">
        {showProgress ? (
          <div
            key={index}
            className="hero-progress h-px origin-left bg-bronze"
            style={{ animationDuration: `${HERO_INTERVAL_MS}ms` }}
          />
        ) : null}
      </div>
    </section>
  );
};
