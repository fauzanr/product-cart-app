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

export type ResponsePagination<T> = Pagination & T;
