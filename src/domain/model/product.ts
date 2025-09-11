export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  image: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface ProductAdditionalInfo {
  label: string;
  value: string;
}

export interface ProductSKU {
  id: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: ProductCategory;
  images: ProductImage[];
  additional_info: ProductAdditionalInfo[] | null;
  skus: ProductSKU[];
  created_at: string;
  updated_at: string;
}
