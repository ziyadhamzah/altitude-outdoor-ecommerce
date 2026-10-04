import type { Metadata } from 'next';
import Image from 'next/image';

import { SectionHeading } from '@/components/ui/section-heading';
import { JOURNAL_ENTRIES } from '@/data/journal';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Field notes, route write-ups and gear testing from the ALTITUDE workshop and the trails around it.',
};

export default function JournalPage() {
  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <SectionHeading
        as="h1"
        eyebrow="Journal"
        title="Field notes from the trail."
        description="Long-form entries are published here as part of the ALTITUDE journal. The three entries below are demonstration content for this store."
      />

      <div className="mt-12 space-y-16 md:mt-20 md:space-y-24">
        {JOURNAL_ENTRIES.map((entry, index) => (
          <article
            key={entry.slug}
            className={`grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-12 ${
              index % 2 === 1 ? 'md:[&>figure]:order-2' : ''
            }`}
          >
            <figure
              className={`relative aspect-[16/10] overflow-hidden bg-charcoal md:col-span-7 ${
                index % 2 === 1 ? 'md:order-2' : ''
              }`}
            >
              <Image
                src={entry.image}
                alt={entry.alt}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </figure>

            <div
              className={`flex flex-col justify-center md:col-span-5 ${
                index % 2 === 1 ? 'md:order-1' : ''
              }`}
            >
              <p className="font-mono text-[0.625rem] tracking-[0.22em] text-bronze uppercase">
                {entry.category}
              </p>
              <h2 className="mt-4 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-[-0.025em] uppercase">
                {entry.title}
              </h2>
              <p className="mt-4 font-mono text-[0.625rem] tracking-[0.18em] text-muted uppercase">
                {formatDate(entry.date)} · {entry.readTime} read
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{entry.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
