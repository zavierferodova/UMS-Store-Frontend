import { IPaginationResponse } from '../model/response';
import { PurchaseOrderPayout, PurchaseOrder, PurchaseOrderStatus } from '../model/purchase-order';

export interface GetPurchaseOrdersParams {
  search?: string;
  limit?: number;
  page?: number;
  deletion?: string[];
  payout?: string[];
  po_status?: string[];
}

export interface AddPurchaseOrderParams {
  requester_id: string;
  supplier_id: string;
  payout: PurchaseOrderPayout;
  status: PurchaseOrderStatus;
  note?: string;
  items?: {
    product_sku: string;
    price: number;
    amounts: number;
    supplier_discount?: number;
  }[];
}

export interface UpdatePurchaseOrderParams {
  payout?: PurchaseOrderPayout;
  status?: PurchaseOrderStatus;
  rejection_message?: string;
  note?: string;
  approver_id?: string;
}

export interface ReplacePurchaseOrderItemsParams {
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
  getPurchaseOrder(id: string): Promise<PurchaseOrder | null>;
  updatePurchaseOrder(id: string, params: UpdatePurchaseOrderParams): Promise<PurchaseOrder | null>;
  replacePurchaseOrderItems(
    purchaseOrderId: string,
    params: ReplacePurchaseOrderItemsParams,
  ): Promise<PurchaseOrder | null>;
}
