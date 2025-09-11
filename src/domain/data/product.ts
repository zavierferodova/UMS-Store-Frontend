import { IPaginationResponse } from "@/domain/model/response";
import { Product, ProductCategory, ProductImage, ProductSKU } from "@/domain/model/product";

export type GetProductsParams = {
    search?: string;
    limit?: number;
    page?: number;
}

export type GetCategoriesParams = {
    search?: string;
    limit?: number;
    page?: number;
};

export type AddProductParams = {
    name: string;
    description: string;
    price: number;
    category: string;
    images: File[];
    skus: string[];
    additional_info: { label: string; value: string }[];
};

export type UpdateProductParams = {
    name: string;
    description: string;
    price: number;
    category: string;
    images: { id: string; file?: File; src: string }[];
    skus: { id?: string; sku: string; }[];
    additional_info: { label: string; value: string }[];
}

export type UpdateSKUParams = {
    sku?: string;
    stock?: number;
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
    getProducts(params?: GetProductsParams): Promise<IPaginationResponse<Product>>;
    createCategory(name: string): Promise<ProductCategory | null>;
    getCategories(params?: GetCategoriesParams): Promise<IPaginationResponse<ProductCategory>>;
    updateCategory(id: string, name: string): Promise<ProductCategory | null>;
    deleteCategory(id: string): Promise<boolean>;
    addSKU(product_id: string, sku: string): Promise<ProductSKU|null>;
    updateSKU(sku: string, params: UpdateSKUParams): Promise<ProductSKU|null>;
    checkSKU(sku: string): Promise<boolean>;
}