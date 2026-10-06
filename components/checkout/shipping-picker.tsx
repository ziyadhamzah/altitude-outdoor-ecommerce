'use client';

import { useMemo } from 'react';

import { OptionRow } from '@/components/checkout/option-row';
import { SHIPPING_OPTIONS, getDeliveryEstimate } from '@/data/shipping';
import { formatIDR } from '@/lib/format';
import type { ShippingMethodId } from '@/types/order';

type ShippingPickerProps = {
  value: ShippingMethodId;
  onChange: (value: ShippingMethodId) => void;
};

export const ShippingPicker = ({ value, onChange }: ShippingPickerProps) => {
  const estimates = useMemo(
    () => new Map(SHIPPING_OPTIONS.map((option) => [option.id, getDeliveryEstimate(option)])),
    [],
  );

  return (
    <fieldset>
      <legend className="field-label">Shipping method</legend>
      <div className="mt-4 space-y-3">
        {SHIPPING_OPTIONS.map((option) => (
          <OptionRow
            key={option.id}
            name="shipping"
            value={option.id}
            checked={value === option.id}
            onSelect={(next) => onChange(next as ShippingMethodId)}
            label={option.label}
            detail={option.detail}
            meta={`${option.estimate} · ${formatIDR(option.cost)}`}
          >
            <span className="font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase">
              Estimated arrival {estimates.get(option.id)}
            </span>
          </OptionRow>
        ))}
      </div>
    </fieldset>
  );
};