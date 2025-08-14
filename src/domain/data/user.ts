import { IPaginationResponse } from "@/domain/model/response";
import { User } from "@/domain/model/user";

export type GetUsersParams = {
    search?: string;
    limit?: number;
    page?: number;
}

export type UpdateUserParams= {
    name?: string;
    email?: string;
    username?: string;
    role?: "admin" | "procurement" | "cashier";
    gender?: string;
    phone?: string;
    address?: string;
}

export interface IUserData {
    getUsers(params?: GetUsersParams): Promise<IPaginationResponse<User>>;
    getUser(id: string): Promise<User | null>;
    updateUser(id: string, data: UpdateUserParams): Promise<User | null>;
}