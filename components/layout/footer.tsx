import Link from 'next/link';

import { BRAND, FOOTER_COLUMNS, NAV_ITEMS } from '@/data/site';

export const Footer = () => (
  <footer className="bg-charcoal text-offwhite">
    <div className="alt-container py-16 md:py-24">
      <div className="flex flex-col gap-12 border-b border-offwhite/15 pb-12 lg:flex-row lg:justify-between lg:gap-20">
        <div className="max-w-sm">
          <p className="font-display text-3xl tracking-[0.22em] uppercase">{BRAND.name}</p>
          <p className="mt-4 font-mono text-[0.625rem] tracking-[0.28em] text-bronze uppercase">
            {BRAND.tagline}
          </p>
          <p className="mt-6 text-sm text-offwhite/60">
            Equipment for hiking, camping, trekking and travel — designed to be carried, worn and
            trusted season after season.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="font-mono text-[0.625rem] tracking-[0.22em] text-offwhite/40 uppercase">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-opacity duration-300 hover:opacity-60"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-8 font-mono text-[0.625rem] tracking-[0.18em] text-offwhite/40 uppercase md:flex-row md:items-center md:justify-between">
        <p>© 2026 {BRAND.name}. All rights reserved.</p>
        <div className="flex flex-wrap gap-6">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </div>
        <p>Demonstration store — payment simulated</p>
      </div>
    </div>
  </footer>
);
