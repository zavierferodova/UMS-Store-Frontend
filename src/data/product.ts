import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APP_URL } from "@/config/env";
import { GetProductsParams, IProductData } from "@/domain/data/product";
import { IPaginationResponse } from "@/domain/model/response";
import { Product, ProductCategory } from "@/domain/model/product";
import { fetchJSON } from "@/lib/fetch";
import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";

export type GetCategoriesParams = {
    search?: string;
    limit?: number;
    page?: number;
};

class ProductData implements IProductData {
    constructor(private readonly serverside: boolean) {
    // pass
    }
    
    private getAuthSession(): Promise<Session | null> {
        if (this.serverside) {
            return getServerSession(authOptions);
        } else {
            return getSession();
        }
    }

    async getProducts(params?: GetProductsParams): Promise<IPaginationResponse<Product>> {
        try {
            const { page = 1, limit = 10, search } = params ?? {};
            
            let query = `?page=${page}&limit=${limit}`;
            
            if (search) {
                query += `&search=${encodeURIComponent(search)}`;
            }
            
            const session = await this.getAuthSession();
            const response = await fetchJSON(`${APP_URL}/apis/products${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
                },
            });
            
            if (!response) {
                throw new Error('Failed to fetch products');
            }
            
            return {
                data: response.data,
                meta: response.meta
            };
        } catch {
            return {
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    next: null,
                    previous: null,
                },
            };
        }
    }

    async createCategory(name: string): Promise<ProductCategory | null> {
        try {
            const session = await this.getAuthSession();
            const response = await fetchJSON(`${APP_URL}/apis/products/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
                },
                body: JSON.stringify({ name }),
            });

            if (response) {
                const { data } = response;
                return data;
            }

            return null;
        } catch {
            return null;
        }
    }

    async getCategories(params?: GetCategoriesParams): Promise<IPaginationResponse<ProductCategory>> {
        try {
            const { page = 1, limit = 10, search } = params ?? {};
            
            let query = `?page=${page}&limit=${limit}`;
            
            if (search) {
                query += `&search=${encodeURIComponent(search)}`;
            }

            const session = await this.getAuthSession();
            const response = await fetchJSON(`${APP_URL}/apis/products/categories${query}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
                },
            });

            if (response) {
                return {
                    data: response.data,
                    meta: response.meta,
                };
            }

            return {
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    next: null,
                    previous: null,
                },
            };
        } catch {
            return {
                data: [],
                meta: {
                    total: 0,
                    page: 1,
                    limit: 10,
                    next: null,
                    previous: null,
                },
            };
        }
    }

    async updateCategory(id: string, name: string): Promise<ProductCategory | null> {
        try {
            const session = await this.getAuthSession();
            const response = await fetchJSON(`${APP_URL}/apis/products/categories/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
                },
                body: JSON.stringify({ name }),
            });

            if (response) {
                return response.data;
            }
            return null;
        } catch {
            return null;
        }
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const session = await this.getAuthSession();
            await fetchJSON(`${APP_URL}/apis/products/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...(session?.access_token && { 'Authorization': `Bearer ${session.access_token}` }),
                },
            });
            return true;
        } catch {
            return false;
        }
    }
}

export const productData = new ProductData(false);
export const productDataServer = new ProductData(true);
export default productData
