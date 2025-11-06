import { Supplier } from './supplier';
import { User } from './user';

export interface PurchaseOrder {
  id: string;
  code: string;
  user: User;
  supplier: Supplier;
  payout: POPayout;
  note?: string | null;
  draft: boolean;
  completed: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export enum POPayout {
  CASH = 'cash',
  PARTNERSHIP = 'partnership',
}
