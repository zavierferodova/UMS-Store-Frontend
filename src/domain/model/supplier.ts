export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  discount: number | null;
  sales: SupplierSales[] | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupplierSales {
  name: string;
  phone: string;
}
