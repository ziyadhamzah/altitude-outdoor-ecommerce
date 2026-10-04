'use client';

import { cn } from '@/lib/cn';

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
};

export const QuantitySelector = ({
  value,
  min = 1,
  max,
  onChange,
  label = 'Quantity',
  size = 'md',
  className,
}: QuantitySelectorProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div className={className}>
      <span className="field-label">{label}</span>
      <div
        className={cn(
          'inline-flex items-center border border-line bg-white',
          size === 'sm' ? 'h-10' : 'h-12',
        )}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={!canDecrease}
          aria-label="Decrease quantity"
          className={cn(
            'h-full w-11 font-mono text-sm transition-colors hover:bg-offwhite-200 disabled:cursor-not-allowed disabled:opacity-30',
          )}
        >
          &minus;
        </button>
        <span
          aria-live="polite"
          className={cn(
            'min-w-10 text-center font-mono text-sm tabular-nums',
            size === 'sm' ? 'h-full leading-10' : 'h-full leading-12',
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={!canIncrease}
          aria-label="Increase quantity"
          className="h-full w-11 font-mono text-sm transition-colors hover:bg-offwhite-200 disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
      {max > 0 ? (
        <p className="mt-2 font-mono text-[0.625rem] tracking-[0.14em] text-muted uppercase">
          Max {max} available
        </p>
      ) : null}
    </div>
  );
};
