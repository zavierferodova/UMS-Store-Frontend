import { IPaginationResponse } from "../model/response";
import { Product } from "../model/product";

export type GetProductsParams = {
    search?: string;
    limit?: number;
    page?: number;
}

export interface IProductData {
    getProducts(params?: GetProductsParams): Promise<IPaginationResponse<Product>>;
}