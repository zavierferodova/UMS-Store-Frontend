import { PaymentMethod } from '../model/payment-method';
import { IPaginationResponse } from '../model/response';

export interface IPaymentMethodParams {
  page: number;
  limit: number;
  search?: string;
  status?: string[];
}

export interface CreatePaymentMethodParams {
  supplier_id: string;
  name: string;
  owner: string;
  account_number: string;
}

export interface UpdatePaymentMethodParams {
  name: string;
  owner: string;
  account_number: string;
  is_deleted?: boolean;
}

export interface IPaymentMethodData {
  getPaymentMethods(params: IPaymentMethodParams): Promise<IPaginationResponse<PaymentMethod>>;
  getPaymentMethod(id: string): Promise<PaymentMethod | null>;
  createPaymentMethod(data: CreatePaymentMethodParams): Promise<PaymentMethod | null>;
  updatePaymentMethod(id: string, data: UpdatePaymentMethodParams): Promise<PaymentMethod | null>;
  deletePaymentMethod(id: string): Promise<boolean>;
}
