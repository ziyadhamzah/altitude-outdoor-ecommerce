import Link from 'next/link';

/** Store-wide 404. Product pages render their own copy from their route. */
export default function NotFound() {
  return (
    <div className="alt-container flex min-h-[70svh] flex-col justify-center pt-28 pb-20 md:pt-36">
      <p className="alt-eyebrow alt-eyebrow-bronze">Error 404</p>
      <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,7vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
        Page not found
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
        This page doesn&apos;t exist or has moved. The collection is still where you left it.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn btn-dark">
          Back to shop
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}