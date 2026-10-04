import { ProductCard } from './product-card';
import type { Product } from '@/types/product';

type ProductGridProps = {
  products: Product[];
  columns?: 2 | 3 | 4;
  priorityCount?: number;
};

const COLUMN_CLASSES: Record<NonNullable<ProductGridProps['columns']>, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export const ProductGrid = ({ products, columns = 4, priorityCount = 0 }: ProductGridProps) => (
  <div className={`grid ${COLUMN_CLASSES[columns]} gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16`}>
    {products.map((product, index) => (
      <ProductCard key={product.id} product={product} priority={index < priorityCount} />
    ))}
  </div>
);
