import { cn } from '@/lib/cn';
import { CHECKOUT_STEPS, type CheckoutStepId } from '@/lib/checkout';

export { CHECKOUT_STEPS, type CheckoutStepId };

type CheckoutStepsProps = {
  current: CheckoutStepId;
  className?: string;
};

/** Progress rail for the checkout: CART / INFORMATION / SHIPPING / PAYMENT. */
export const CheckoutSteps = ({ current, className }: CheckoutStepsProps) => {
  const currentIndex = CHECKOUT_STEPS.indexOf(current);

  return (
    <nav aria-label="Checkout steps" className={cn('mt-8', className)}>
      <ol className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {CHECKOUT_STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = step === current;

          return (
            <li key={step} className="flex items-center gap-4">
              <span
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'font-mono text-[0.6875rem] tracking-[0.2em] uppercase',
                  active ? 'text-ink' : done ? 'text-positive' : 'text-muted',
                )}
              >
                <span className="mr-2 text-bronze">{`0${index + 1}`}</span>
                {step}
                {done ? <span className="sr-only"> (completed)</span> : null}
              </span>
              {index < CHECKOUT_STEPS.length - 1 ? (
                <span aria-hidden className="h-px w-6 bg-line" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};