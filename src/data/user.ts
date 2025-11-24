import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import { GetUsersParams, IUserData, UpdateUserParams } from '@/domain/data/user';
import { IPaginationResponse } from '@/domain/model/response';
import { User } from '@/domain/model/user';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class UserData implements IUserData {
  constructor(private readonly serverside: boolean) {
    // pass
  }

  async getAuthSession(): Promise<Session | null> {
    if (this.serverside) {
      return await getServerSession(authOptions);
    } else {
      return await getSession();
    }
  }

  async getUsers(params?: GetUsersParams): Promise<IPaginationResponse<User>> {
    try {
      const { page, limit, search, role } = params ?? {
        page: 1,
        limit: 10,
        search: undefined,
        role: undefined,
      };

      let query = `?page=${page}&limit=${limit}`;

      if (search) {
        query += `&search=${search}`;
      }

      if (role) {
        query += `&role=${role.join(',')}`;
      }

      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/users${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response) {
        const { data, meta } = response;
        return {
          data,
          meta,
        };
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

  async getUser(id: string): Promise<User | null> {
    try {
      const session = await this.getAuthSession();

      const response = await fetchJSON(`${APP_URL}/apis/users/${id}`, {
        method: 'GET',
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

  async updateUser(id: string, data: UpdateUserParams): Promise<User | null> {
    try {
      const session = await this.getAuthSession();
      const response = await fetchJSON(`${APP_URL}/apis/users/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
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
}

export const userData = new UserData(false);
export const userDataServer = new UserData(true);
export default userData;
