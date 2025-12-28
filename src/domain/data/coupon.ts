import { Coupon, CouponType } from '../model/coupon';
import { IPaginationResponse } from '../model/response';

export type CreateCouponParams = {
  name: string;
  type: CouponType;
  voucher_value?: number;
  discount_percentage?: number;
  start_time: string;
  end_time: string;
};

export type GetCouponsParams = {
  page?: number;
  limit?: number;
  search?: string;
  start_time?: string;
  end_time?: string;
  type?: CouponType[];
  disabled?: string[];
};

export type UpdateCouponParams = {
  name?: string;
  disabled?: boolean;
  start_time?: string;
  end_time?: string;
};

export interface ICouponData {
  createCoupon(params: CreateCouponParams): Promise<Coupon | null>;
  updateCoupon(id: string, params: UpdateCouponParams): Promise<Coupon | null>;
  getCoupons(params?: GetCouponsParams): Promise<IPaginationResponse<Coupon>>;
  getCoupon(id: string): Promise<Coupon | null>;
}
