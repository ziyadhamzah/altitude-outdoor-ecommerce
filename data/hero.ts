export type HeroSlide = {
  index: string;
  eyebrow: string;
  headline: string;
  description: string;
  cta: { label: string; href: string };
  image: string;
  alt: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    index: '01',
    eyebrow: 'ALTITUDE',
    headline: 'EXPLORE BEYOND.',
    description: 'Gear for a higher journey.',
    cta: { label: 'SHOP COLLECTION', href: '/shop' },
    image: '/images/editorial/hero-01.jpg',
    alt: 'Wide mountain valley at first light, snow on the surrounding peaks',
  },
  {
    index: '02',
    eyebrow: 'BUILT FOR THE WILD',
    headline: 'FIND YOUR NEXT TRAIL.',
    description: 'Technical gear designed for every step beyond the ordinary.',
    cta: { label: 'EXPLORE GEAR', href: '/shop' },
    image: '/images/editorial/hero-02.jpg',
    alt: 'Sunbeams breaking through cloud over a highland plateau at sunset',
  },
  {
    index: '03',
    eyebrow: 'HIGHER GROUND',
    headline: 'GEAR UP. GO HIGHER.',
    description: 'Built for mountain trails, open roads, and everything between.',
    cta: { label: 'SHOP COLLECTION', href: '/shop' },
    image: '/images/editorial/hero-03.jpg',
    alt: 'Hiker following a marked trail across an open highland ridge',
  },
  {
    index: '04',
    eyebrow: 'THE JOURNEY STARTS HERE',
    headline: 'MADE TO MOVE.',
    description: 'Outdoor essentials designed to travel further.',
    cta: { label: 'DISCOVER ALTITUDE', href: '/collections' },
    image: '/images/editorial/hero-04.jpg',
    alt: 'Jagged coastal mountain massif rising above a northern fjord',
  },
];

export const HERO_INTERVAL_MS = 6500;
