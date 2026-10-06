'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

type OptionRowProps = {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  label: string;
  detail: string;
  /** Right aligned mono readout, e.g. an estimate and a price. */
  meta?: ReactNode;
  children?: ReactNode;
};

/** Selectable shipping / payment card: a square marker instead of a radio dot. */
export const OptionRow = ({
  name,
  value,
  checked,
  onSelect,
  label,
  detail,
  meta,
  children,
}: OptionRowProps) => (
  <label
    className={cn(
      'block cursor-pointer border bg-white p-5 transition-colors duration-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-bronze',
      checked ? 'border-ink' : 'border-line hover:border-ink',
    )}
  >
    <input
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={() => onSelect(value)}
      className="sr-only"
    />
    <span className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
      <span className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            'mt-1 h-3 w-3 shrink-0 border transition-colors duration-300',
            checked ? 'border-ink bg-ink' : 'border-line bg-white',
          )}
        />
        <span>
          <span className="block font-mono text-[0.6875rem] tracking-[0.2em] uppercase">
            {label}
          </span>
          <span className="mt-2 block text-sm text-muted">{detail}</span>
        </span>
      </span>
      {meta ? <span className="font-mono text-sm">{meta}</span> : null}
    </span>
    {children ? <span className="mt-4 block border-t border-line pt-4">{children}</span> : null}
  </label>
);