import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  CashierBookStats,
  GetCashierBooks,
  GetCashierBookTransactions,
  ICashierBookData,
} from '@/domain/data/cashier-book';
import { CashierBook } from '@/domain/model/cashier-book';
import { Transaction } from '@/domain/model/transaction';
import { IPaginationResponse } from '@/domain/model/response';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

export class CashierBookData implements ICashierBookData {
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

  async openCashierBook(cashier_id: string, cash_drawer: number): Promise<CashierBook | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify({ cashier_id, cash_drawer }),
      });

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }

  async closeCashierBook(): Promise<CashierBook | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books/close`, {
        method: 'PATCH',
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

  async getActiveCashierBook(): Promise<CashierBook | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books/active`, {
        method: 'GET',
        headers: {
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

  async getActiveCashierBookStats(): Promise<CashierBookStats | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books/active-stats`, {
        method: 'GET',
        headers: {
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

  async getCashierBook(id: string): Promise<CashierBook | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books/${id}`, {
        method: 'GET',
        headers: {
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

  async getCashierBookStats(id: string): Promise<CashierBookStats | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/cashier-books/${id}/stats`, {
        method: 'GET',
        headers: {
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

  async getCashierBooks(params?: GetCashierBooks): Promise<IPaginationResponse<CashierBook>> {
    try {
      const session = await this.getAuthSession();
      const query = new URLSearchParams();
      if (params?.page) query.append('page', params.page.toString());
      if (params?.limit) query.append('limit', params.limit.toString());
      if (params?.search) query.append('search', params.search);
      if (params?.time_open) query.append('time_open', params.time_open);
      if (params?.time_closed) query.append('time_closed', params.time_closed);
      if (params?.status && params.status.length > 0)
        query.append('status', params.status.join(','));

      const response = await fetchJSON(`${APP_URL}/apis/cashier-books?${query.toString()}`, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response) {
        return response;
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

  async getCashierBookTransactions(
    id: string,
    params?: GetCashierBookTransactions,
  ): Promise<IPaginationResponse<Transaction>> {
    try {
      const session = await this.getAuthSession();
      const query = new URLSearchParams();
      if (params) {
        if (params.page) query.append('page', params.page.toString());
        if (params.limit) query.append('limit', params.limit.toString());
        if (params.search) query.append('search', params.search);
        if (params.start_date) query.append('start_date', params.start_date);
        if (params.end_date) query.append('end_date', params.end_date);
        if (params.transaction_status) {
          params.transaction_status.forEach((status) => query.append('transaction_status', status));
        }
        if (params.payment) {
          params.payment.forEach((method) => query.append('payment', method));
        }
      }

      const response = await fetchJSON(
        `${APP_URL}/apis/cashier-books/${id}/transactions?${query.toString()}`,
        {
          method: 'GET',
          headers: {
            ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
          },
        },
      );

      if (response) {
        return response;
      }

      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          next: null,
          previous: null,
        },
      };
    } catch {
      return {
        data: [],
        meta: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 10,
          next: null,
          previous: null,
        },
      };
    }
  }
}

const cashierBookData = new CashierBookData(false);
export default cashierBookData;
