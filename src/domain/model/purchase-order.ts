import { ProductSingleSKU } from './product';
import { Supplier } from './supplier';
import { User } from './user';

export interface PurchaseOrderItem {
  product: ProductSingleSKU;
  price: number;
  amounts: number;
  supplier_discount?: number;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  requester: User;
  approver: User | null;
  supplier: Supplier;
  payout: PurchaseOrderPayout;
  note: string | null;
  items: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  rejection_message: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  WAITING_APPROVAL = 'waiting_approval',
  CANCELLED = 'cancelled',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum PurchaseOrderPayout {
  CASH = 'cash',
  PARTNERSHIP = 'partnership',
}
