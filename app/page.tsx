import { BRAND } from '@/data/site';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="alt-eyebrow">PHASE 01 — FOUNDATION</p>
      <h1 className="mt-8 text-[clamp(3rem,12vw,8rem)] leading-[0.85] tracking-[-0.04em]">
        {BRAND.name}
      </h1>
      <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.32em] text-bronze uppercase">
        {BRAND.tagline}
      </p>
      <div className="rule mt-16 w-24" />
      <p className="mt-16 max-w-md text-sm text-muted">
        Design tokens, typography, catalog data and the app shell are in place. The homepage is
        built in Phase 02.
      </p>
    </main>
  );
}
