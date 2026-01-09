import { CashierBook } from '../model/cashier-book';
import { IPaginationResponse } from '../model/response';
import { Transaction } from '../model/transaction';

export type GetCashierBooks = {
  page?: number;
  limit?: number;
  search?: string;
  time_open?: string;
  time_closed?: string;
  cashier_id?: string;
  status?: string[];
};

export type GetCashierBookTransactions = {
  search?: string;
  transaction_status?: string[];
  payment?: string[];
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
};

export type CashierBookStats = {
  cash: {
    count: number;
    value: number;
  };
  cashless: {
    count: number;
    value: number;
  };
  discount: {
    count: number;
    value: number;
  };
  voucher: {
    count: number;
    value: number;
  };
};

export interface ICashierBookData {
  openCashierBook(cashier_id: string, cash_drawer: number): Promise<CashierBook | null>;
  closeCashierBook(): Promise<CashierBook | null>;
  getActiveCashierBook(): Promise<CashierBook | null>;
  getActiveCashierBookStats(): Promise<CashierBookStats | null>;
  getCashierBook(id: string): Promise<CashierBook | null>;
  getCashierBookStats(id: string): Promise<CashierBookStats | null>;
  getCashierBooks(params?: GetCashierBooks): Promise<IPaginationResponse<CashierBook>>;
  getCashierBookTransactions(
    id: string,
    params?: GetCashierBookTransactions,
  ): Promise<IPaginationResponse<Transaction>>;
}
