import { IPaginationResponse } from "@/domain/model/response";
import { Supplier } from "@/domain/model/supplier";

export type GetSuppliersParams = {
    search?: string;
    limit?: number;
    page?: number;
    status?: string[];
}

export type UpdateSupplierParams = {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    discount?: number;
    is_deleted?: boolean;
}

export type CreateSupplierParams = {
    name: string;
    email?: string;
    phone: string;
    address: string;
    discount?: number;
}

export interface ISupplierData {
    getSuppliers(params?: GetSuppliersParams): Promise<IPaginationResponse<Supplier>>;
    getSupplier(id: string): Promise<Supplier | null>;
    updateSupplier(id: string, data: UpdateSupplierParams): Promise<Supplier | null>;
    createSupplier(data: CreateSupplierParams): Promise<Supplier | null>;
    deleteSupplier(id: string): Promise<boolean>;
}