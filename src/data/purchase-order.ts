import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { APP_URL } from '@/config/env';
import {
  AddPurchaseOrderParams,
  GetPurchaseOrdersParams,
  IPurchaseOrderData,
} from '@/domain/data/purchase-order';
import { PurchaseOrder, POPayout } from '@/domain/model/purchase-order';
import { IPaginationResponse } from '@/domain/model/response';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class PurchaseOrderData implements IPurchaseOrderData {
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

  async addPurchaseOrder(params: AddPurchaseOrderParams): Promise<PurchaseOrder | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/purchase-orders`, {
        method: 'POST',
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

  async getPurchaseOrders(
    params?: GetPurchaseOrdersParams,
  ): Promise<IPaginationResponse<PurchaseOrder>> {
    try {
      const { search, draft, completed, payout, status, page = 1, limit = 10 } = params ?? {};
      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${encodeURIComponent(search)}`;
      }

      if (draft) {
        query += `&draft=${draft.join(',')}`;
      }

      if (completed) {
        query += `&completed=${completed.join(',')}`;
      }

      if (payout) {
        query += `&payout=${payout.join(',')}`;
      }

      if (status) {
        query += `&status=${status.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/purchase-orders${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (!response) {
        throw new Error('Failed to fetch purchase orders');
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
}

export const purchaseOrderData = new PurchaseOrderData(false);
export const purchaseOrderDataServer = new PurchaseOrderData(true);
export default purchaseOrderData;
