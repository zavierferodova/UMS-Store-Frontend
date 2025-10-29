import { IPaginationResponse } from '../model/response';
import { PurchaseOrder } from '../model/purchase-order';

export interface GetPurchaseOrdersParams {
  search?: string;
  limit?: number;
  page?: number;
  status?: string[];
  payout?: string[];
  draft?: string[];
  completed?: string[];
}

export interface IPurchaseOrderData {
  getPurchaseOrders(params?: GetPurchaseOrdersParams): Promise<IPaginationResponse<PurchaseOrder>>;
}
