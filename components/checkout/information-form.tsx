'use client';

import type { FormEvent } from 'react';

import { cn } from '@/lib/cn';
import type { CustomerDraft, CustomerErrors, CustomerField } from '@/lib/checkout';

type FieldConfig = {
  name: CustomerField;
  label: string;
  placeholder: string;
  autoComplete: string;
  /** Spans the full width on large screens. */
  full?: boolean;
  multiline?: boolean;
};

const FIELDS: FieldConfig[] = [
  {
    name: 'fullName',
    label: 'Full name',
    placeholder: 'Reza Mahendra',
    autoComplete: 'name',
    full: true,
  },
  {
    name: 'phone',
    label: 'Phone number',
    placeholder: '0812 3456 7890',
    autoComplete: 'tel',
  },
  {
    name: 'city',
    label: 'City / region',
    placeholder: 'Bandung, West Java',
    autoComplete: 'address-level2',
  },
  {
    name: 'address',
    label: 'Street address',
    placeholder: 'Jl. Surya Sumantri No. 12, RT 04 RW 09',
    autoComplete: 'street-address',
    full: true,
    multiline: true,
  },
  {
    name: 'note',
    label: 'Order note',
    placeholder: 'Optional — leave the parcel with the front desk.',
    autoComplete: 'off',
    full: true,
    multiline: true,
  },
];

type InformationFormProps = {
  value: CustomerDraft;
  errors: CustomerErrors;
  onChange: (field: CustomerField, value: string) => void;
  onSubmit: () => void;
};

export const InformationForm = ({ value, errors, onChange, onSubmit }: InformationFormProps) => (
  <form
    noValidate
    onSubmit={(event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <div className="grid gap-5 md:grid-cols-2">
      {FIELDS.map((field) => {
        const error = errors[field.name];
        const id = `checkout-${field.name}`;

        return (
          <div key={field.name} className={cn(field.full && 'md:col-span-2')}>
            <label htmlFor={id} className="field-label">
              {field.label}
              {field.name === 'note' ? ' (optional)' : ''}
            </label>
            {field.multiline ? (
              <textarea
                id={id}
                name={field.name}
                rows={3}
                value={value[field.name]}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="field resize-y"
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.name === 'phone' ? 'tel' : 'text'}
                value={value[field.name]}
                onChange={(event) => onChange(field.name, event.target.value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className="field"
              />
            )}
            {error ? (
              <p id={`${id}-error`} className="field-error">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>

    <button type="submit" className="btn btn-dark mt-8 w-full sm:w-auto">
      Continue to shipping
    </button>
  </form>
);