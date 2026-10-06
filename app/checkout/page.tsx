'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { CheckoutSteps } from '@/components/checkout/checkout-steps';
import type { CheckoutStepId } from '@/components/checkout/checkout-steps';
import { CheckoutSummary } from '@/components/checkout/checkout-summary';
import { InformationForm } from '@/components/checkout/information-form';
import { PaymentPicker } from '@/components/checkout/payment-picker';
import { ShippingPicker } from '@/components/checkout/shipping-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { getDeliveryEstimate, getShippingCost, getShippingOption } from '@/data/shipping';
import { getAvailableLines, getCartEntries, getCartSubtotal } from '@/lib/cart';
import type { CheckoutStep, CustomerDraft, CustomerErrors, CustomerField } from '@/lib/checkout';
import {
  clearCheckoutDraft,
  hasErrors,
  readCheckoutDraft,
  toCustomer,
  validateCustomer,
  writeCheckoutDraft,
} from '@/lib/checkout';
import { createOrder, saveOrder } from '@/lib/orders';
import { useHydrated } from '@/lib/use-hydrated';
import { useCartStore } from '@/store/cart';
import type { PaymentMethodId, ShippingMethodId } from '@/types/order';

const PLACE_ORDER_MS = 1100;

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  // Read once per mount. The server has no localStorage, and the page renders a
  // loading shell until `hydrated`, so the restored values never reach the markup
  // the server produced.
  const [saved] = useState(() => readCheckoutDraft());

  const [step, setStep] = useState<CheckoutStepId>(saved.step);
  const [draft, setDraft] = useState<CustomerDraft>(saved.customer);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [shippingId, setShippingId] = useState<ShippingMethodId>(saved.shippingId);
  const [paymentId, setPaymentId] = useState<PaymentMethodId>(saved.paymentId);
  const [placing, setPlacing] = useState(false);

  const placingTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (placingTimer.current) window.clearTimeout(placingTimer.current);
    },
    [],
  );

  // Keeps the customer's progress across a refresh; cleared once an order exists.
  useEffect(() => {
    if (!hydrated) return;
    writeCheckoutDraft({ step: step as CheckoutStep, customer: draft, shippingId, paymentId });
  }, [hydrated, step, draft, shippingId, paymentId]);

  const lines = useMemo(() => getAvailableLines(getCartEntries(items)), [items]);
  const shipping = getShippingOption(shippingId);
  const estimatedDelivery = useMemo(() => getDeliveryEstimate(shipping), [shipping]);
  const subtotal = useMemo(() => getCartSubtotal(lines), [lines]);
  const shippingCost = useMemo(() => getShippingCost(shipping, subtotal), [shipping, subtotal]);
  const emptyCart = hydrated && lines.length === 0;

  const goToStep = (next: CheckoutStepId) => {
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldChange = (field: CustomerField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleInformationSubmit = () => {
    const nextErrors = validateCustomer(draft);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;
    goToStep('SHIPPING');
  };

  const handlePlaceOrder = () => {
    if (placing || lines.length === 0) return;

    // A restored draft can predate a validation rule, so the order is only placed
    // once the delivery details still pass.
    const nextErrors = validateCustomer(draft);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      goToStep('INFORMATION');
      return;
    }

    setPlacing(true);

    // A short pause so the simulated payment reads as a real step.
    placingTimer.current = window.setTimeout(() => {
      const order = createOrder({
        lines,
        customer: toCustomer(draft),
        shippingId,
        paymentId,
      });

      saveOrder(order);
      clearCheckoutDraft();
      clearCart();
      router.push(`/order/${order.id}`);
    }, PLACE_ORDER_MS);
  };

  const summaryActions =
    step === 'SHIPPING' ? (
      <div className="flex flex-col gap-3">
        <button type="button" onClick={() => goToStep('PAYMENT')} className="btn btn-dark w-full">
          Continue to payment
        </button>
        <button
          type="button"
          onClick={() => goToStep('INFORMATION')}
          className="btn btn-outline w-full"
        >
          Back to information
        </button>
      </div>
    ) : step === 'PAYMENT' ? (
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={placing}
          aria-disabled={placing}
          className="btn btn-dark w-full"
        >
          {placing ? 'Placing order…' : 'Place order'}
        </button>
        <button
          type="button"
          onClick={() => goToStep('SHIPPING')}
          disabled={placing}
          className="btn btn-outline w-full"
        >
          Back to shipping
        </button>
        <p className="text-center font-mono text-[0.625rem] tracking-[0.16em] text-muted uppercase">
          Simulated payment — nothing is charged
        </p>
      </div>
    ) : null;

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Checkout</p>
        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
              Secure your gear
            </h1>
            <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.24em] uppercase">
              Three steps. No real transaction.
            </p>
          </div>
        </div>
        <CheckoutSteps current={step} />
      </header>

      {!hydrated ? (
        <p className="mt-16 font-mono text-[0.6875rem] tracking-[0.2em] text-muted uppercase">
          Loading checkout…
        </p>
      ) : emptyCart ? (
        <div className="flex min-h-[45svh] flex-col justify-center py-16">
          <EmptyState
            eyebrow="Nothing to check out"
            title="Your cart is empty"
            description="Add gear to your journey before checking out. Placing an order empties the cart, so start a new selection first."
            action={{ label: 'Explore the shop', href: '/shop' }}
          />
          <div className="mt-6">
            <Link
              href="/cart"
              className="font-mono text-[0.625rem] tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink"
            >
              Back to cart
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {step === 'INFORMATION' ? (
              <section>
                <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">
                  Delivery information
                </h2>
                <p className="mt-4 max-w-lg text-sm text-muted">
                  Used for the delivery notice only. Nothing is sent to a server — the details stay
                  in this browser.
                </p>
                <div className="mt-8">
                  <InformationForm
                    value={draft}
                    errors={errors}
                    onChange={handleFieldChange}
                    onSubmit={handleInformationSubmit}
                  />
                </div>
              </section>
            ) : null}

            {step === 'SHIPPING' ? (
              <section>
                <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">
                  Shipping method
                </h2>
                <p className="mt-4 max-w-lg text-sm text-muted">
                  Delivery windows are calculated from today and shift with the courier schedule.
                </p>
                <div className="mt-8">
                  <ShippingPicker value={shippingId} onChange={setShippingId} />
                </div>
                <div className="mt-8 border border-line bg-white p-5">
                  <h3 className="font-mono text-[0.625rem] tracking-[0.2em] uppercase">
                    Delivering to
                  </h3>
                  <p className="mt-3 text-sm">{draft.fullName}</p>
                  <p className="mt-1 text-sm text-muted">{draft.phone}</p>
                  <p className="mt-1 max-w-md text-sm text-muted">
                    {draft.address}, {draft.city}
                  </p>
                  <button
                    type="button"
                    onClick={() => goToStep('INFORMATION')}
                    className="mt-4 font-mono text-[0.625rem] tracking-[0.2em] uppercase underline underline-offset-4 transition-colors duration-300 hover:text-ink"
                  >
                    Edit information
                  </button>
                </div>
              </section>
            ) : null}

            {step === 'PAYMENT' ? (
              <section>
                <h2 className="font-mono text-[0.6875rem] tracking-[0.22em] uppercase">
                  Payment method
                </h2>
                <p className="mt-4 max-w-lg text-sm text-muted">
                  Every option is simulated. A fake payment reference is attached to the order so
                  you can see how a real confirmation would read.
                </p>
                <div className="mt-8">
                  <PaymentPicker value={paymentId} onChange={setPaymentId} />
                </div>
              </section>
            ) : null}
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <CheckoutSummary
                lines={lines}
                shippingCost={shippingCost}
                estimatedDelivery={estimatedDelivery}
              >
                {summaryActions}
              </CheckoutSummary>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}