'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="alt-container flex min-h-[70svh] flex-col justify-center pt-28 pb-20 md:pt-36">
      <p className="alt-eyebrow alt-eyebrow-bronze">Error</p>
      <h1 className="mt-6 text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
        Something went wrong
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
        Unable to load this product.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn btn-dark">
          Try again
        </button>
        <Link href="/shop" className="btn btn-outline">
          Back to shop
        </Link>
      </div>
    </div>
  );
}