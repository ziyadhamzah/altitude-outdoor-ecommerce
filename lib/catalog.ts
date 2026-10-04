import { SEARCH_KEYWORDS } from '@/data/search';
import {
  CATEGORY_LABELS,
  PRICE_RANGES,
  type PriceRange,
  type PriceRangeId,
  type Product,
  type ProductCategory,
  type SortId,
  type VariantSelection,
} from '@/types/product';

/** The single variant dimension that carries per-option stock, if any. */
export const getVariantStockDimension = (product: Product): string | undefined =>
  product.variants?.find((variant) =>
    variant.options.some(
      (option) => product.variantStock?.[`${variant.name}: ${option}`] !== undefined,
    ),
  )?.name;

export const getVariantStock = (product: Product, selection: VariantSelection = {}): number => {
  const dimension = getVariantStockDimension(product);
  if (!dimension) return product.stock;
  const option = selection[dimension];
  if (!option) return product.stock;
  return product.variantStock?.[`${dimension}: ${option}`] ?? 0;
};

export const getMaxQuantity = (product: Product, selection: VariantSelection = {}): number =>
  Math.max(0, getVariantStock(product, selection));

export const isVariantSelectionComplete = (
  product: Product,
  selection: VariantSelection,
): boolean => (product.variants ?? []).every((variant) => Boolean(selection[variant.name]));

export const formatVariantLabel = (product: Product, selection: VariantSelection): string =>
  (product.variants ?? [])
    .map((variant) => selection[variant.name])
    .filter((value): value is string => Boolean(value))
    .join(' / ');

export type StockTone = 'positive' | 'warning' | 'critical';

export type StockState = {
  label: string;
  tone: StockTone;
  stock: number;
};

export const getStockState = (product: Product, selection: VariantSelection = {}): StockState => {
  const stock = getVariantStock(product, selection);
  if (stock <= 0) return { label: 'OUT OF STOCK', tone: 'critical', stock };
  if (stock <= 4) return { label: `ONLY ${stock} LEFT`, tone: 'warning', stock };
  return { label: 'IN STOCK', tone: 'positive', stock };
};

export type CatalogQuery = {
  query?: string;
  category?: ProductCategory | 'all';
  minPrice?: number;
  maxPrice?: number;
  sort?: SortId;
};

const matchesQuery = (product: Product, query: string): boolean => {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;

  const haystack = [
    product.name,
    product.category,
    CATEGORY_LABELS[product.category],
    product.description,
    product.material,
    ...product.specs.map((spec) => `${spec.label} ${spec.value}`),
    ...(SEARCH_KEYWORDS[product.slug] ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return tokens.every((token) => haystack.includes(token));
};

const sortProducts = (list: Product[], sort: SortId): Product[] => {
  const sorted = [...list];
  switch (sort) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'featured':
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
};

export const filterProducts = (list: Product[], query: CatalogQuery): Product[] => {
  const { query: search = '', category = 'all', minPrice, maxPrice, sort = 'featured' } = query;

  const filtered = list.filter((product) => {
    if (category !== 'all' && product.category !== category) return false;
    if (typeof minPrice === 'number' && product.price < minPrice) return false;
    if (typeof maxPrice === 'number' && product.price > maxPrice) return false;
    return matchesQuery(product, search);
  });

  return sortProducts(filtered, sort);
};

export const getPriceBounds = (list: Product[]): { min: number; max: number } => {
  if (list.length === 0) return { min: 0, max: 0 };
  const prices = list.map((product) => product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
};

export const DEFAULT_PRICE_RANGE: PriceRange = PRICE_RANGES[0];

export const getPriceRange = (id: string): PriceRange =>
  PRICE_RANGES.find((range) => range.id === id) ?? DEFAULT_PRICE_RANGE;

export const isPriceRangeId = (value: string): value is PriceRangeId =>
  PRICE_RANGES.some((range) => range.id === value);
