'use client';

import { OptionRow } from '@/components/checkout/option-row';
import { PAYMENT_METHODS } from '@/data/payment';
import type { PaymentMethodId } from '@/types/order';

type PaymentPickerProps = {
  value: PaymentMethodId;
  onChange: (value: PaymentMethodId) => void;
};

export const PaymentPicker = ({ value, onChange }: PaymentPickerProps) => (
  <fieldset>
    <legend className="field-label">Payment method</legend>
    <div className="mt-4 space-y-3">
      {PAYMENT_METHODS.map((method) => (
        <OptionRow
          key={method.id}
          name="payment"
          value={method.id}
          checked={value === method.id}
          onSelect={(next) => onChange(next as PaymentMethodId)}
          label={method.label}
          detail={method.detail}
        >
          <span className="block text-sm text-muted">{method.instructions}</span>
        </OptionRow>
      ))}
    </div>

    <p className="mt-5 border border-line bg-white p-4 font-mono text-[0.625rem] leading-relaxed tracking-[0.14em] text-muted uppercase">
      Simulated payment — this demo never asks for card numbers, CVV, PIN, OTP or bank
      credentials.
    </p>
  </fieldset>
);