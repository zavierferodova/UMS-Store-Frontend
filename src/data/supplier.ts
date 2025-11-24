import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  CreateSupplierParams,
  GetSuppliersParams,
  ISupplierData,
  UpdateSupplierParams,
} from '@/domain/data/supplier';
import { IPaginationResponse } from '@/domain/model/response';
import { Supplier } from '@/domain/model/supplier';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class SupplierData implements ISupplierData {
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

  async getSuppliers(params?: GetSuppliersParams): Promise<IPaginationResponse<Supplier>> {
    try {
      const { page, limit, search, status } = params ?? {
        page: 1,
        limit: 10,
        search: undefined,
        status: undefined,
      };

      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${search}`;
      }

      if (status) {
        query += `&status=${status.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response) {
        const { data, meta } = response;
        return {
          data,
          meta,
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

  async getSupplier(id: string): Promise<Supplier | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
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

  async updateSupplier(id: string, data: UpdateSupplierParams): Promise<Supplier | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  async createSupplier(data: CreateSupplierParams): Promise<Supplier | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      await fetchJSON(`${APP_URL}/apis/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}

export const supplierData = new SupplierData(false);
export const supplierDataServer = new SupplierData(true);
export default supplierData;
