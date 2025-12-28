import { Coupon, CouponCode, CouponType } from '../model/coupon';
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

export type CreateCouponCodeParams = {
  code: string;
  stock: number;
};

export type UpdateCouponCodeParams = {
  stock?: number;
  disabled?: boolean;
};

export type GetCouponCodesParams = {
  page?: number;
  limit?: number;
  search?: string;
  disabled?: string[];
};

export type CouponCodeAvailabilityResponse = {
  code: string;
  is_available: boolean;
};

export type CheckCouponCodeUsageResponse = {
  code: string;
  stock: number;
  can_use: boolean;
};

export interface ICouponData {
  createCoupon(params: CreateCouponParams): Promise<Coupon | null>;
  updateCoupon(id: string, params: UpdateCouponParams): Promise<Coupon | null>;
  getCoupons(params?: GetCouponsParams): Promise<IPaginationResponse<Coupon>>;
  getCoupon(id: string): Promise<Coupon | null>;
  createCouponCode(couponId: string, params: CreateCouponCodeParams): Promise<CouponCode | null>;
  updateCouponCode(code: string, params: UpdateCouponCodeParams): Promise<CouponCode | null>;
  getCouponCodes(couponId: string, params: GetCouponCodesParams): Promise<CouponCode[]>;
  checkCouponCode(code: string): Promise<CouponCodeAvailabilityResponse | null>;
  checkCouponCodeUsage(code: string): Promise<CheckCouponCodeUsageResponse | null>;
}
