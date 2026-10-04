'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TrackingPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <header className="border-b border-line pb-8">
        <p className="alt-eyebrow alt-eyebrow-bronze">Tracking</p>
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,4rem)] leading-[0.95] tracking-[-0.035em] uppercase">Tracking coming soon</h1>
        <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-muted">ORDER ID: {id || '—'}</p>
      </header>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/order/${id}`} className="btn btn-outline">
          Back to order
        </Link>
        <Link href="/shop" className="btn btn-dark">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}