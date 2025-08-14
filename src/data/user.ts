import { APP_URL } from "@/config/env";
import { GetUsersParams, IUserData, UpdateUserParams } from "@/domain/data/user";
import { IPaginationResponse } from "@/domain/model/response";
import { User } from "@/domain/model/user";
import { fetchJSON } from "@/lib/fetch";
import { getSession } from "next-auth/react";

async function getUsers(params?: GetUsersParams): Promise<IPaginationResponse<User>> {
    try {
        const { page, limit, search } = params ?? {
            page: 1,
            limit: 10,
            search: undefined
        }

        let query = `?page=${page}&limit=${limit}`;
        
        if (search) {
            query += `&search=${search}`;
        }
        
        const session = await getSession();
        const response = await fetchJSON(`${APP_URL}/apis/users/list${query}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
    
        if (response) {
            const { data, meta } = response;
            return {
                data,
                meta
            }
        }
    
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 10,
                next: null,
                previous: null,
            },
        };
    } catch {
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 10,
                next: null,
                previous: null,
            },
        };
    }
}

async function getUser(id: string): Promise<User | null> {
    try {
        const session = await getSession();
        const response = await fetchJSON(`${APP_URL}/apis/users/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        });
    
        if (response) {
            const { data } = response;
            return data;
        }
    
        return null;
    } catch {
        return null;
    }
}

async function updateUser(id: string, data: UpdateUserParams): Promise<User | null> {
    try {
        const session = await getSession();
        const response = await fetchJSON(`${APP_URL}/apis/users/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    
        if (response) {
            const { data } = response;
            return data;
        }
    
        return null;
    } catch {
        return null;
    }
}

const userData: IUserData = {
    getUsers,
    getUser,
    updateUser
}

export default userData