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
  { id: 'price-asc', label: 'PRICE LOW → HIGH' },
  { id: 'price-desc', label: 'PRICE HIGH → LOW' },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]['id'];
