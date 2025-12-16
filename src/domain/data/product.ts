import { IPaginationResponse } from '@/domain/model/response';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductSingleSKU,
  ProductSKU,
} from '@/domain/model/product';

export type GetSKUProductsParams = {
  search?: string;
  limit?: number;
  page?: number;
  deletion?: string[];
  categories?: string[];
  supplier_id?: string;
};

export type GetCategoriesParams = {
  search?: string;
  limit?: number;
  page?: number;
};

export type AddProductParams = {
  name: string;
  description: string;
  price?: number | null;
  category: string;
  images: File[];
  skus: {
    sku: string;
    supplier?: string | null;
  }[];
  additional_info: { label: string; value: string }[];
};

export type UpdateProductParams = {
  name: string;
  description: string;
  price?: number | null;
  category: string;
  images: { id: string; file?: File; src: string }[];
  skus: { id?: string; sku: string; supplier?: string | null }[];
  is_deleted?: boolean;
  additional_info: { label: string; value: string }[];
};

export type UpdateSKUParams = {
  sku?: string;
  stock?: number;
  supplier?: string | null;
};

export type UpdateImageParams = {
  image?: File;
  order_number?: number;
};

export interface IProductData {
  uploadImages(product_id: string, images: File[]): Promise<ProductImage[]>;
  updateImage(id: string, params: UpdateImageParams): Promise<ProductImage | null>;
  deleteImage(id: string, order_number?: number): Promise<boolean>;
  addProduct(product: AddProductParams): Promise<Product | null>;
  updateProduct(id: string, product: UpdateProductParams): Promise<Product | null>;
  getProduct(id: string): Promise<Product | null>;
  getProductsBySKU(params?: GetSKUProductsParams): Promise<IPaginationResponse<ProductSingleSKU>>;
  deleteProduct(id: string): Promise<boolean>;
  createCategory(name: string): Promise<ProductCategory | null>;
  getCategories(params?: GetCategoriesParams): Promise<IPaginationResponse<ProductCategory>>;
  updateCategory(category_id: string, name: string): Promise<ProductCategory | null>;
  deleteCategory(category_id: string): Promise<boolean>;
  addSKU(product_id: string, sku: string, supplier_id?: string | null): Promise<ProductSKU | null>;
  updateSKU(sku: string, params: UpdateSKUParams): Promise<ProductSKU | null>;
  checkSKU(sku: string): Promise<boolean>;
}
