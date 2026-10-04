export const BRAND = {
  name: 'ALTITUDE',
  tagline: 'GEAR FOR A HIGHER JOURNEY',
  niche: 'Premium Outdoor & Adventure Gear',
  city: 'Bandung, Indonesia',
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const SITE_DESCRIPTION =
  'Premium outdoor gear for hiking, camping, travel, and adventure.';

export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'SHOP', href: '/shop' },
  { label: 'COLLECTIONS', href: '/collections' },
  { label: 'JOURNAL', href: '/journal' },
];

export const FOOTER_COLUMNS: { title: string; links: NavItem[] }[] = [
  {
    title: 'EXPLORE',
    links: [
      { label: 'SHOP ALL', href: '/shop' },
      { label: 'APPAREL', href: '/shop?category=apparel' },
      { label: 'BAGS', href: '/shop?category=bags' },
      { label: 'FOOTWEAR', href: '/shop?category=footwear' },
      { label: 'ACCESSORIES', href: '/shop?category=accessories' },
    ],
  },
  {
    title: 'BRAND',
    links: [
      { label: 'OUR STORY', href: '/collections' },
      { label: 'JOURNAL', href: '/journal' },
      { label: 'SHIPPING & RETURNS', href: '/shipping' },
    ],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'ORDER TRACKING', href: '/tracking' },
      { label: 'SIZE GUIDE', href: '/shop' },
      { label: 'CONTACT', href: '/contact' },
    ],
  },
];
