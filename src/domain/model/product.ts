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
  images: ProductImage[];
  name: string;
  description: string;
  price: number;
  category?: ProductCategory;
  skus: ProductSKU[];
  additional_info: ProductAdditionalInfo[] | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductSingleSKU extends Omit<Product, 'skus'> {
  sku: ProductSKU;
}
