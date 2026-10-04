import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * Phase 5 placeholder. It exists so the cart checkout button never lands on a
 * 404; the real checkout flow is built in the next phase.
 */
export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout is not part of this demonstration store yet.',
};

export default function CheckoutPage() {
  return (
    <div className="alt-container flex min-h-[70svh] flex-col justify-center pt-28 pb-20 md:pt-36">
      <p className="alt-eyebrow alt-eyebrow-bronze">Checkout</p>
      <h1 className="mt-6 max-w-3xl text-[clamp(2.25rem,7vw,5rem)] leading-[0.9] tracking-[-0.04em] uppercase">
        Checkout opens next
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
        Your cart is saved. Customer details, shipping options and payment are part of the next
        phase of this build, so nothing is charged here.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/cart" className="btn btn-dark">
          Back to cart
        </Link>
        <Link href="/shop" className="btn btn-outline">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}