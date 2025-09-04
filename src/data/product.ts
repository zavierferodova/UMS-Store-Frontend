import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { APP_URL } from "@/config/env";
import { GetProductsParams, IProductData } from "@/domain/data/product";
import { IPaginationResponse } from "@/domain/model/response";
import { Product } from "@/domain/model/product";
import { fetchJSON } from "@/lib/fetch";
import { getServerSession, Session } from "next-auth";
import { getSession } from "next-auth/react";

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
            
            return response;
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
}

export const productData = new ProductData(false);
export const productDataServer = new ProductData(true);
export default productData
