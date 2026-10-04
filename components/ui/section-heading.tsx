import Link from 'next/link';

import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
  tone?: 'light' | 'dark';
  as?: 'h1' | 'h2';
  className?: string;
};

export const SectionHeading = ({
  eyebrow,
  title,
  description,
  link,
  tone = 'light',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) => (
  <div
    className={cn(
      'flex flex-col gap-6 border-t pt-8 md:flex-row md:items-end md:justify-between',
      tone === 'light' ? 'border-line' : 'border-offwhite/15',
      className,
    )}
  >
    <div className="max-w-2xl">
      <p className={cn('alt-eyebrow', tone === 'dark' && 'text-offwhite/60')}>{eyebrow}</p>
      <Heading
        className={cn(
          'mt-5 text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.03em]',
          tone === 'dark' && 'text-offwhite',
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn('mt-5 max-w-md text-sm', tone === 'dark' ? 'text-offwhite/70' : 'text-muted')}>
          {description}
        </p>
      ) : null}
    </div>

    {link ? (
      <Link
        href={link.href}
        className={cn(
          'alt-link shrink-0 font-mono text-[0.6875rem] tracking-[0.2em] uppercase',
          tone === 'dark' ? 'text-offwhite' : 'text-ink',
        )}
      >
        {link.label}
      </Link>
    ) : null}
  </div>
);
