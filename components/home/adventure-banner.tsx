import Image from 'next/image';
import Link from 'next/link';

export const AdventureBanner = () => (
  <section className="relative isolate flex min-h-[75svh] items-end overflow-hidden bg-charcoal text-offwhite">
    <Image
      src="/images/editorial/banner-go-higher.jpg"
      alt="Iceberg drifting through a fjord in Greenland"
      fill
      sizes="100vw"
      className="object-cover -z-10"
    />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-charcoal/30" />

    <div className="alt-container w-full py-20 md:py-28">
      <p className="alt-eyebrow text-bronze">Altitude</p>
      <h2 className="mt-6 text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.88] tracking-[-0.04em] uppercase">
        Go higher.
      </h2>
      <p className="mt-6 max-w-md text-sm text-offwhite/80 md:text-base">
        Gear built for wherever the journey takes you.
      </p>
      <Link href="/shop" className="btn btn-light mt-10">
        Explore collection
      </Link>
    </div>
  </section>
);
