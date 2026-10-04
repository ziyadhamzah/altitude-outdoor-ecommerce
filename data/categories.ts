import { products } from './products';
import type { ProductCategory } from '@/types/product';

export type CategoryEntry = {
  slug: ProductCategory;
  label: string;
  index: string;
  image: string;
  alt: string;
  tagline: string;
};

export const CATEGORY_ENTRIES: CategoryEntry[] = [
  {
    slug: 'apparel',
    label: 'APPAREL',
    index: '01',
    image: '/images/editorial/category-apparel.jpg',
    alt: 'Hiker crossing a rocky alpine ridge line',
    tagline: 'Shells, fleeces and pants for weather that changes hourly.',
  },
  {
    slug: 'bags',
    label: 'BAGS',
    index: '02',
    image: '/images/editorial/category-bags.jpg',
    alt: 'Coastal fjord seen from a high rocky viewpoint',
    tagline: 'Packs sized for a day hike and for three days out.',
  },
  {
    slug: 'footwear',
    label: 'FOOTWEAR',
    index: '03',
    image: '/images/editorial/category-footwear.jpg',
    alt: 'Granite boulder formations lit by early sunrise',
    tagline: 'Grip and stability for trail, talus and everything loose.',
  },
  {
    slug: 'accessories',
    label: 'ACCESSORIES',
    index: '04',
    image: '/images/editorial/category-accessories.jpg',
    alt: 'Low evening sun over a coastal headland',
    tagline: 'The small pieces that finish a kit.',
  },
];

export const categoryHref = (slug: ProductCategory) => `/shop?category=${slug}`;

export const getCategoryCount = (slug: ProductCategory): number =>
  products.filter((product) => product.category === slug).length;
