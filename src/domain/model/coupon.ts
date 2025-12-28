export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  voucher_value: number | null;
  discount_percentage: number | null;
  start_time: Date;
  end_time: Date;
  is_disabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export enum CouponType {
  voucher = 'voucher',
  discount = 'discount',
}

export interface CouponCode {
  code: string;
  stock: number;
  used: number;
  disabled: boolean;
  created_at: Date;
  updated_at: Date;
}
