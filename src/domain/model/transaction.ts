import { Coupon, CouponCode } from './coupon';
import { User } from './user';

export interface Transaction {
  id: string;
  code: string;
  cashier: User;
  pay: number | null;
  payment: TransactionPayment | null;
  discount_total: number | null;
  sub_total: number;
  total: number;
  note: string | null;
  is_saved: boolean;
  paid_time: string | null;
  created_at: string;
  updated_at: string;
  items: TransactionItem[];
  coupons: TransactionCoupon[];
}

export interface TransactionCoupon extends Coupon {
  code: CouponCode;
}

export interface TransactionItem {
  name: string;
  sku_code: string;
  unit_price: number;
  amount: number;
}

export enum TransactionPayment {
  CASH = 'cash',
  CASHLESS = 'cashless',
}
