import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  IPaymentMethodData,
  IPaymentMethodParams,
  CreatePaymentMethodParams,
  UpdatePaymentMethodParams,
} from '@/domain/data/payment-method';
import { IPaginationResponse } from '@/domain/model/response';
import { PaymentMethod } from '@/domain/model/payment-method';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class PaymentMethodData implements IPaymentMethodData {
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

  async getPaymentMethods(
    params?: IPaymentMethodParams,
  ): Promise<IPaginationResponse<PaymentMethod>> {
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
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/payments/${query}`, {
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

  async getPaymentMethod(id: string): Promise<PaymentMethod | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/payments/${id}`, {
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

  async createPaymentMethod(data: CreatePaymentMethodParams): Promise<PaymentMethod | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/payments`, {
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

  async updatePaymentMethod(
    id: string,
    data: UpdatePaymentMethodParams,
  ): Promise<PaymentMethod | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/suppliers/payments/${id}`, {
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

  async deletePaymentMethod(id: string): Promise<boolean> {
    try {
      const session = await this.getAuthSession();
      await fetchJSON(`${APP_URL}/apis/suppliers/payments/${id}`, {
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

export const paymentMethodData = new PaymentMethodData(false);
export const paymentMethodDataServer = new PaymentMethodData(true);
export default paymentMethodData;
