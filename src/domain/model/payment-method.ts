import { Supplier } from './supplier';

export interface PaymentMethod {
  id: string;
  supplier: Supplier;
  name: string;
  owner: string;
  account_number: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
