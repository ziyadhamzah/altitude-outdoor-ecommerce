import Image from 'next/image';
import Link from 'next/link';

export const BrandStory = () => (
  <section className="bg-charcoal text-offwhite">
    <div className="alt-container py-20 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="alt-eyebrow text-bronze">Our story</p>
          <h2 className="mt-6 text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.9] tracking-[-0.035em] uppercase">
            Built for
            <br />
            the journey.
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-offwhite/70">
            ALTITUDE was created for people who choose the longer route, chase higher ground, and
            find something worth remembering along the way.
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-offwhite/50">
            We started with a single question: which pieces of kit actually earn their weight in a
            pack? Everything we make answers that question first — weight, weather, repairability —
            and only then looks.
          </p>
          <Link href="/journal" className="btn btn-outline-light mt-10">
            Read the journal
          </Link>
        </div>

        <div className="lg:col-span-7">
          <figure className="relative aspect-[4/5] overflow-hidden bg-charcoal-800 md:aspect-[16/11]">
            <Image
              src="/images/editorial/story-01.jpg"
              alt="A weathered summit marker standing on a high ridge at dawn"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </figure>
          <figcaption className="mt-4 flex items-center justify-between gap-6 border-t border-offwhite/15 pt-4 font-mono text-[0.625rem] tracking-[0.2em] text-offwhite/40 uppercase">
            <span>Summit marker, high ridge</span>
            <span>Field notes 01</span>
          </figcaption>
        </div>
      </div>
    </div>
  </section>
);
