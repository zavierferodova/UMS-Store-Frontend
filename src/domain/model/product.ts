export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImages {
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
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: ProductCategory;
  images: ProductImages[];
  additional_info: ProductAdditionalInfo[];
  skus: ProductSKU[];
  created_at: string;
  updated_at: string;
}
