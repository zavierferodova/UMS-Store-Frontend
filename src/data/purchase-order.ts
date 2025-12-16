import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  AddPurchaseOrderParams,
  GetPurchaseOrdersParams,
  IPurchaseOrderData,
  ReplacePurchaseOrderItemsParams,
  UpdatePurchaseOrderParams,
} from '@/domain/data/purchase-order';
import { PurchaseOrder } from '@/domain/model/purchase-order';
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
      const { search, payout, deletion, po_status, page = 1, limit = 10 } = params ?? {};

      const query = new URLSearchParams();

      query.append('page', page.toString());
      query.append('limit', limit.toString());

      if (search) {
        query.append('search', search);
      }

      if (payout) {
        query.append('payout', payout.join(','));
      }

      if (deletion) {
        query.append('deletion', deletion.join(','));
      }

      if (po_status) {
        query.append('po_status', po_status.join(','));
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/purchase-orders?${query.toString()}`, {
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

  async getPurchaseOrder(id: string): Promise<PurchaseOrder | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/purchase-orders/${id}`, {
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

  async updatePurchaseOrder(
    id: string,
    params: UpdatePurchaseOrderParams,
  ): Promise<PurchaseOrder | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/purchase-orders/${id}`, {
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

  async replacePurchaseOrderItems(
    purchaseOrderId: string,
    params: ReplacePurchaseOrderItemsParams,
  ): Promise<PurchaseOrder | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(
        `${APP_URL}/apis/purchase-orders/${purchaseOrderId}/items/replace`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
          },
          body: JSON.stringify(params),
        },
      );

      if (response) {
        return response.data;
      }

      return null;
    } catch {
      return null;
    }
  }
}

export const purchaseOrderData = new PurchaseOrderData(false);
export const purchaseOrderDataServer = new PurchaseOrderData(true);
export default purchaseOrderData;
