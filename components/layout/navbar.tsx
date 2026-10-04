'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { NAV_ITEMS } from '@/data/site';
import { getCartCount } from '@/lib/cart';
import { cn } from '@/lib/cn';
import { useHydrated } from '@/lib/use-hydrated';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { SearchOverlay } from './search-overlay';

const NAV_LINK =
  'font-mono text-[0.6875rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-60';

export const Navbar = () => {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const items = useCartStore((state) => state.items);
  const wishlistIds = useWishlistStore((state) => state.productIds);

  const overlay = pathname === '/' && !scrolled && !menuOpen && !searchOpen;

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 32);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const count = (label: string, value: number) => (hydrated ? `${label} (${value})` : label);

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-altitude',
          overlay ? 'text-offwhite' : 'border-b border-line bg-offwhite text-ink',
        )}
      >
        <div className="alt-container flex h-16 items-center justify-between gap-6 md:h-20">
          <Link
            href="/"
            aria-label="ALTITUDE — home"
            className="font-display text-base tracking-[0.24em] uppercase md:text-lg"
          >
            Altitude
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={NAV_LINK}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 md:gap-7">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(NAV_LINK, 'hidden md:inline-block')}
            >
              Search
            </button>
            <Link href="/wishlist" className={cn(NAV_LINK, 'hidden md:inline-block')}>
              {count('Wishlist', wishlistIds.length)}
            </Link>
            <Link href="/cart" className={NAV_LINK}>
              {count('Cart', getCartCount(items))}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className={cn(NAV_LINK, 'md:hidden')}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 flex flex-col bg-charcoal px-5 pt-24 pb-10 text-offwhite md:hidden">
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-offwhite/15 py-5 font-display text-3xl tracking-[-0.02em] uppercase"
              >
                <span className="mr-4 font-mono text-[0.625rem] tracking-[0.2em] text-offwhite/40">
                  0{index + 1}
                </span>
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="border-b border-offwhite/15 py-5 text-left font-display text-3xl tracking-[-0.02em] uppercase"
            >
              <span className="mr-4 font-mono text-[0.625rem] tracking-[0.2em] text-offwhite/40">
                0{NAV_ITEMS.length + 1}
              </span>
              Search
            </button>
            <Link
              href="/wishlist"
              onClick={closeMenu}
              className="border-b border-offwhite/15 py-5 font-display text-3xl tracking-[-0.02em] uppercase"
            >
              <span className="mr-4 font-mono text-[0.625rem] tracking-[0.2em] text-offwhite/40">
                0{NAV_ITEMS.length + 2}
              </span>
              Wishlist
            </Link>
          </nav>
          <p className="mt-auto font-mono text-[0.625rem] tracking-[0.24em] text-offwhite/40 uppercase">
            Gear for a higher journey
          </p>
        </div>
      ) : null}

      <SearchOverlay open={searchOpen} onClose={closeMenu} />
    </>
  );
};
