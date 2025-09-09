import { IPaginationResponse } from "@/domain/model/response";
import { Product, ProductCategory } from "@/domain/model/product";

export type GetProductsParams = {
    search?: string;
    limit?: number;
    page?: number;
}

export interface IProductData {
    getProducts(params?: GetProductsParams): Promise<IPaginationResponse<Product>>;
    createCategory(name: string): Promise<ProductCategory | null>;
    getCategories(): Promise<IPaginationResponse<ProductCategory>>;
    updateCategory(id: string, name: string): Promise<ProductCategory | null>;
    deleteCategory(id: string): Promise<boolean>;
    checkSKU(sku: string): Promise<boolean>;
}