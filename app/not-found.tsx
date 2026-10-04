import Link from 'next/link';

/**
 * Every product page is statically generated, so an unknown product slug is the
 * only way to reach this page. Copy therefore speaks about a product, and the
 * generic routes back out keep it useful from anywhere else in the store.
 */
export default function NotFound() {
  return (
    <div className="alt-container flex min-h-[70svh] flex-col justify-center pt-28 pb-20 md:pt-36">
      <p className="alt-eyebrow alt-eyebrow-bronze">Error 404</p>
      <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,7vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
        Product not found
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
        The gear you are looking for doesn&apos;t exist or may have been removed.
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