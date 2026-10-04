import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="alt-container flex min-h-[70svh] flex-col justify-center pt-28 pb-20 md:pt-36">
      <p className="alt-eyebrow alt-eyebrow-bronze">Error 404</p>
      <h1 className="mt-6 text-[clamp(3rem,10vw,7rem)] leading-[0.88] tracking-[-0.04em] uppercase">
        Off route.
      </h1>
      <p className="mt-6 max-w-md text-sm text-muted md:text-base">
        This page does not exist, or the piece you were looking for has moved. The trail is still
        there though.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/shop" className="btn btn-dark">
          Browse the collection
        </Link>
        <Link href="/" className="btn btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}