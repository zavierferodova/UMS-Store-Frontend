import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  AddProductParams,
  GetCategoriesParams,
  GetSKUProductsParams,
  IProductData,
  UpdateImageParams,
  UpdateProductParams,
  UpdateSKUParams,
} from '@/domain/data/product';
import { IPaginationResponse } from '@/domain/model/response';
import {
  Product,
  ProductCategory,
  ProductImage,
  ProductSingleSKU,
  ProductSKU,
} from '@/domain/model/product';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

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

  async uploadImages(product_id: string, images: File[]): Promise<ProductImage[]> {
    try {
      const session = await this.getAuthSession();
      const formData = new FormData();

      images.forEach((image) => {
        formData.append('images', image);
        formData.append('product_id', product_id);
      });

      const response = await fetchJSON(`${APP_URL}/apis/products/images`, {
        method: 'POST',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: formData,
      });

      if (response) {
        return response.data;
      }

      return [];
    } catch {
      return [];
    }
  }

  async updateImage(id: string, params: UpdateImageParams): Promise<ProductImage | null> {
    try {
      const formData = new FormData();

      if (params.image) {
        formData.append('image', params.image);
      }

      if (params.order_number) {
        formData.append('order_number', params.order_number.toString());
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/images/${id}`, {
        method: 'PATCH',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: formData,
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async deleteImage(id: string): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/images/${id}`, {
        method: 'DELETE',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  async addProduct(params: AddProductParams): Promise<Product | null> {
    try {
      const { images, ...rest } = params;
      const additionalInfo = rest.additional_info.filter((item) => item.label && item.value);

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({
          ...rest,
          additional_info: additionalInfo.length ? additionalInfo : undefined,
        }),
      });

      if (response) {
        const { id } = response.data;
        const uploadedImages = await this.uploadImages(id, images);
        return { ...response.data, images: uploadedImages };
      }

      return null;
    } catch {
      return null;
    }
  }

  async updateProduct(id: string, product: UpdateProductParams): Promise<Product | null> {
    try {
      const { images, skus, ...rest } = product;
      const additionalInfo = rest.additional_info.filter((item) => item.label && item.value);
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({
          ...rest,
          additional_info: additionalInfo.length ? additionalInfo : null,
        }),
      });

      if (!response) {
        return null;
      }

      const responseImages = response.data.images;
      const addedImages = images.filter(
        (img) => !responseImages.some((i: ProductImage) => i.id === img.id),
      );
      const deletedImages = responseImages.filter(
        (img: ProductImage) =>
          !images.some((i: UpdateProductParams['images'][number]) => i.id === img.id),
      );
      let imageIdOrders: (string | null)[] = images.map(
        (img) => responseImages.find((i: ProductImage) => i.id === img.id)?.id ?? null,
      );
      let addImagePromise: Promise<ProductImage[]> = Promise.all([]);
      let deleteImagePromises = [];
      let updateImagePromises: Promise<ProductImage | null>[] = [];

      if (deletedImages.length) {
        deleteImagePromises = deletedImages.map((img: ProductImage) => this.deleteImage(img.id));
        const deletedImagesResponse = await Promise.all(deleteImagePromises);

        if (!deletedImagesResponse.every((res) => res)) {
          return null;
        }

        imageIdOrders = imageIdOrders.filter(
          (id) => !deletedImages.some((img: ProductImage) => img.id === id),
        );
      }

      if (addedImages.length) {
        addImagePromise = this.uploadImages(
          id,
          addedImages.map((img) => img.file!),
        );

        const addedImagesResponse = await addImagePromise;
        if (addedImagesResponse?.length) {
          const emptyIdIndex: number[] = imageIdOrders
            .map((id, index) => (!id ? index : -1))
            .filter((index) => index !== -1);
          for (let i = 0; i < emptyIdIndex.length; i++) {
            imageIdOrders[emptyIdIndex[i]] = addedImagesResponse[i].id;
          }
        } else {
          return null;
        }
      }

      if (imageIdOrders.length) {
        updateImagePromises = imageIdOrders.map((id, index) =>
          id ? this.updateImage(id, { order_number: index }) : Promise.resolve(null),
        );
        const updateImagesResponse = await Promise.all(updateImagePromises);
        if (!updateImagesResponse.every((res) => res !== null)) {
          return null;
        }
      }

      const editedSkus = skus.filter((sku) => sku.id);
      const addedSkus = skus.filter((sku) => !sku.id);
      let editSkuPromises: Promise<ProductSKU | null>[] = [];
      let addSkuPromises: Promise<ProductSKU | null>[] = [];

      if (skus?.length) {
        editSkuPromises = editedSkus.map((sku) => {
          const found = response.data.skus.find((s: ProductSKU) => s.id === sku.id);
          return found
            ? this.updateSKU(found.sku, { sku: sku.sku, supplier: sku.supplier })
            : Promise.resolve(null);
        });
      }

      if (addedSkus?.length) {
        addSkuPromises = addedSkus.map((sku) => this.addSKU(id, sku.sku, sku.supplier));
      }

      const skusResponses = await Promise.all([...editSkuPromises, ...addSkuPromises]);
      if (skusResponses.every((sku) => sku !== null)) {
        return { ...response.data, sku: skusResponses.filter((sku) => sku) };
      }

      return null;
    } catch {
      return null;
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async getProductsBySKU(
    params: GetSKUProductsParams,
  ): Promise<IPaginationResponse<ProductSingleSKU>> {
    try {
      const { page = 1, limit = 10, search, deletion, supplier_id, categories } = params ?? {};

      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${encodeURIComponent(search)}`;
      }

      if (deletion) {
        query += `&deletion=${deletion.join(',')}`;
      }

      if (supplier_id) {
        query += `&supplier_id=${supplier_id}`;
      }

      if (categories) {
        query += `&categories=${categories.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/sku${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (!response) {
        throw new Error('Failed to fetch products by SKU');
      }

      return {
        data: response.data,
        meta: response.meta,
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

  async getProductsCatalogue(
    params: GetSKUProductsParams,
  ): Promise<IPaginationResponse<ProductSingleSKU>> {
    try {
      const { page = 1, limit = 10, search, deletion, supplier_id, categories } = params ?? {};

      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${encodeURIComponent(search)}`;
      }

      if (deletion) {
        query += `&deletion=${deletion.join(',')}`;
      }

      if (supplier_id) {
        query += `&supplier_id=${supplier_id}`;
      }

      if (categories) {
        query += `&categories=${categories.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/catalogue${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (!response) {
        throw new Error('Failed to fetch products by SKU');
      }

      return {
        data: response.data,
        meta: response.meta,
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

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  async createCategory(name: string): Promise<ProductCategory | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
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
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
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
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
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
      const response = await fetchJSON(`${APP_URL}/apis/products/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  async addSKU(
    product_id: string,
    sku: string,
    supplier?: string | null,
  ): Promise<ProductSKU | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/sku`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({ product_id, sku, supplier }),
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async updateSKU(sku: string, params: UpdateSKUParams): Promise<ProductSKU | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/sku/${sku}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(params),
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async checkSKU(sku: string): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/products/sku/${sku}/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return response.data.is_available;
      }

      return false;
    } catch {
      return false;
    }
  }
}

export const productData = new ProductData(false);
export const productDataServer = new ProductData(true);
export default productData;
