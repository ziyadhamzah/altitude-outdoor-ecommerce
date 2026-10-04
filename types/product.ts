export const PRODUCT_CATEGORIES = ['apparel', 'bags', 'footwear', 'accessories'] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  apparel: 'APPAREL',
  bags: 'BAGS',
  footwear: 'FOOTWEAR',
  accessories: 'ACCESSORIES',
};

export type Variant = {
  name: string;
  options: string[];
};

export type VariantSelection = Record<string, string>;

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  images: string[];
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  variants?: Variant[];
  /** Stock per single variant option, keyed by `${variantName}: ${option}`. */
  variantStock?: Record<string, number>;
  specs: ProductSpec[];
  material: string;
  featured: boolean;
  createdAt: string;
};

export const SORT_OPTIONS = [
  { id: 'featured', label: 'FEATURED' },
  { id: 'newest', label: 'NEWEST' },
  { id: 'price-asc', label: 'PRICE: LOW TO HIGH' },
  { id: 'price-desc', label: 'PRICE: HIGH TO LOW' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];

export const PRICE_RANGE_IDS = ['all', 'under-500k', '500k-1m', '1m-2m', 'above-2m'] as const;

export type PriceRangeId = (typeof PRICE_RANGE_IDS)[number];

export type PriceRange = {
  id: PriceRangeId;
  label: string;
  min?: number;
  max?: number;
};

/** Preset bands, disjoint so every product price belongs to exactly one band. */
export const PRICE_RANGES: readonly PriceRange[] = [
  { id: 'all', label: 'ALL PRICES' },
  { id: 'under-500k', label: 'UNDER RP500K', min: 0, max: 499_999 },
  { id: '500k-1m', label: 'RP500K – RP1M', min: 500_000, max: 999_999 },
  { id: '1m-2m', label: 'RP1M – RP2M', min: 1_000_000, max: 1_999_999 },
  { id: 'above-2m', label: 'ABOVE RP2M', min: 2_000_000 },
];
