import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import {
  CheckCouponCodeUsageResponse,
  CouponCodeAvailabilityResponse,
  CreateCouponCodeParams,
  CreateCouponParams,
  GetCouponCodesParams,
  GetCouponsParams,
  ICouponData,
  UpdateCouponCodeParams,
  UpdateCouponParams,
} from '@/domain/data/coupon';
import { Coupon, CouponCode } from '@/domain/model/coupon';
import { IPaginationResponse } from '@/domain/model/response';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class CouponData implements ICouponData {
  constructor(private readonly serverside: boolean) {
    // pass
  }

  private getAuthSession(): Promise<Session | null> {
    if (this.serverside) {
      return getServerSession(authOptions);
    } else {
      return getSession();
    }
  }

  async createCoupon(params: CreateCouponParams): Promise<Coupon | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(params),
      });

      if (response && response.data) {
        return response.data as Coupon;
      }
    } catch {}
    return null;
  }

  async updateCoupon(id: string, params: UpdateCouponParams): Promise<Coupon | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(params),
      });

      if (response && response.data) {
        return response.data as Coupon;
      }
    } catch {}
    return null;
  }

  async getCoupons(params?: GetCouponsParams): Promise<IPaginationResponse<Coupon>> {
    try {
      const session = await this.getAuthSession();
      const searchParams = new URLSearchParams();

      if (params) {
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.start_time) searchParams.append('start_time', params.start_time);
        if (params.end_time) searchParams.append('end_time', params.end_time);
        if (params.type) {
          params.type.forEach((t) => searchParams.append('type', t));
        }
        if (params.disabled) {
          params.disabled.forEach((d) => searchParams.append('disabled', d));
        }
      }

      const queryString = searchParams.toString();
      const url = `${APP_URL}/apis/coupons${queryString ? `?${queryString}` : ''}`;

      const response = await fetchJSON(url, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response && response.data) {
        return {
          data: response.data as Coupon[],
          meta: response.meta as IPaginationResponse<Coupon>['meta'],
        };
      }
    } catch {}
    return {
      data: [],
      meta: {
        total: 0,
        page: 0,
        limit: 0,
        next: null,
        previous: null,
      },
    };
  }

  async getCoupon(id: string): Promise<Coupon | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/${id}`, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response && response.data) {
        return response.data as Coupon;
      }
    } catch {}
    return null;
  }

  async createCouponCode(
    couponId: string,
    params: CreateCouponCodeParams,
  ): Promise<CouponCode | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/${couponId}/codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(params),
      });

      if (response && response.data) {
        return response.data as CouponCode;
      }
    } catch {}
    return null;
  }

  async updateCouponCode(code: string, params: UpdateCouponCodeParams): Promise<CouponCode | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/codes/${code}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
        body: JSON.stringify(params),
      });

      if (response && response.data) {
        return response.data as CouponCode;
      }
    } catch {}
    return null;
  }

  async getCouponCodes(couponId: string, params: GetCouponCodesParams): Promise<CouponCode[]> {
    try {
      const session = await this.getAuthSession();
      const searchParams = new URLSearchParams();

      if (params) {
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.disabled) {
          params.disabled.forEach((d) => searchParams.append('disabled', d));
        }
      }

      const queryString = searchParams.toString();
      const url = `${APP_URL}/apis/coupons/${couponId}/codes${queryString ? `?${queryString}` : ''}`;

      const response = await fetchJSON(url, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response && response.data) {
        return response.data as CouponCode[];
      }
    } catch {}
    return [];
  }

  async checkCouponCode(code: string): Promise<CouponCodeAvailabilityResponse | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/codes/${code}/check`, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response && response.data) {
        return response.data as CouponCodeAvailabilityResponse;
      }
    } catch {}
    return null;
  }

  async checkCouponCodeUsage(code: string): Promise<CheckCouponCodeUsageResponse | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/coupons/codes/${code}/usage`, {
        method: 'GET',
        headers: {
          ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
        },
      });

      if (response && response.data) {
        return response.data as CheckCouponCodeUsageResponse;
      }
    } catch {}
    return null;
  }
}

export const couponData: ICouponData = new CouponData(false);
export const couponDataServer: ICouponData = new CouponData(true);
export default couponData;
