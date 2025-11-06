import { IPaginationResponse } from '../model/response';
import { POPayout, PurchaseOrder } from '../model/purchase-order';

export interface GetPurchaseOrdersParams {
  search?: string;
  limit?: number;
  page?: number;
  status?: string[];
  payout?: string[];
  draft?: string[];
  completed?: string[];
}

export interface AddPurchaseOrderParams {
  user_id: string;
  supplier_id: string;
  payout: POPayout;
  note?: string;
  draft?: boolean;
  items?: {
    product_sku: string;
    price: number;
    amounts: number;
    supplier_discount?: number;
  }[];
}

export interface IPurchaseOrderData {
  getPurchaseOrders(params?: GetPurchaseOrdersParams): Promise<IPaginationResponse<PurchaseOrder>>;
  addPurchaseOrder(params: AddPurchaseOrderParams): Promise<PurchaseOrder | null>;
}
