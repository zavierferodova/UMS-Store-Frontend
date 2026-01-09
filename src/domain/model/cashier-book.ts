import { User } from './user';

export interface CashierBook {
  id: string;
  code: string;
  cash_drawer: number;
  time_open: string;
  time_closed: string | null;
  created_at: string;
  updated_at: string;
  cashier: User;
}
