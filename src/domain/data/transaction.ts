import { IPaginationResponse } from '../model/response';
import { Transaction, TransactionPayment } from '../model/transaction';

export type CreateTransactionParams = {
  cashier: string;
  pay?: number | null;
  payment?: TransactionPayment | null;
  note?: string;
  is_saved?: boolean;
  items: {
    product_sku: string;
    unit_price: number;
    amount: number;
  }[];
};

export type GetTransactionsParams = {
  page?: number;
  limit?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  transaction_status?: string[];
  payment?: TransactionPayment[];
  cashier_id?: string;
};

export type UpdateTransactionParams = {
  pay?: number;
  is_saved?: boolean;
};

export interface ITransactionData {
  createTransaction(data: CreateTransactionParams): Promise<Transaction | null>;
  getTransaction(id: string): Promise<Transaction | null>;
  getTransactions(params: GetTransactionsParams): Promise<IPaginationResponse<Transaction>>;
  updateTransaction(id: string, data: UpdateTransactionParams): Promise<Transaction | null>;
}
