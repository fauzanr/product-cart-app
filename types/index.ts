export interface Pagination {
  limit: number;
  skip: number;
  total: number;
}

export interface ProductRecord {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CartRecord {
  id: number;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountPercentage: number;
    discountedPrice: number;
  }>;
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export type ResponsePagination<T> = Pagination & T;

export interface ProductFilters {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
}
