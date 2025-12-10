import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  CreateTransactionParams,
  GetTransactionsParams,
  ITransactionData,
  UpdateTransactionParams,
} from '@/domain/data/transaction';
import { Transaction } from '@/domain/model/transaction';
import { IPaginationResponse } from '@/domain/model/response';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class TransactionData implements ITransactionData {
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

  async createTransaction(data: CreateTransactionParams): Promise<Transaction | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(data),
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async getTransaction(id: string): Promise<Transaction | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/transactions/${id}`, {
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

  async getTransactions(params: GetTransactionsParams): Promise<IPaginationResponse<Transaction>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        start_date,
        end_date,
        transaction_status,
        payment,
      } = params;
      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${search}`;
      }

      if (start_date) {
        query += `&start_date=${start_date}`;
      }

      if (end_date) {
        query += `&end_date=${end_date}`;
      }

      if (transaction_status && transaction_status.length > 0) {
        query += `&transaction_status=${transaction_status.join(',')}`;
      }

      if (payment && payment.length > 0) {
        query += `&payment=${payment.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/transactions${query}`, {
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

  async updateTransaction(id: string, data: UpdateTransactionParams): Promise<Transaction | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/transactions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(data),
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }
}

export const transactionData = new TransactionData(false);
export const transactionDataServer = new TransactionData(true);
export default transactionData;
