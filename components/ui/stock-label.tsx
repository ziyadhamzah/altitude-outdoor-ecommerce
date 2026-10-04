import { cn } from '@/lib/cn';
import type { StockTone } from '@/lib/catalog';

const TONE_CLASSES: Record<StockTone, string> = {
  positive: 'text-positive',
  warning: 'text-bronze',
  critical: 'text-critical',
};

const TONE_DOT: Record<StockTone, string> = {
  positive: 'bg-positive',
  warning: 'bg-bronze',
  critical: 'bg-critical',
};

type StockLabelProps = {
  label: string;
  detail?: string;
  tone: StockTone;
  className?: string;
};

/** Technical stock readout: mono label with a small square marker, no icons. */
export const StockLabel = ({ label, detail, tone, className }: StockLabelProps) => (
  <p
    className={cn(
      'flex flex-wrap items-center gap-x-2 font-mono text-[0.6875rem] tracking-[0.18em] uppercase',
      TONE_CLASSES[tone],
      className,
    )}
  >
    <span aria-hidden className={cn('h-1.5 w-1.5', TONE_DOT[tone])} />
    {label}
    {detail ? <span className="text-muted">{detail}</span> : null}
  </p>
);