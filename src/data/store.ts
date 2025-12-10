import { authOptions } from '@/config/login';
import { APP_URL } from '@/config/env';
import { IStoreData } from '@/domain/data/store';
import { Store } from '@/domain/model/store';
import { fetchJSON } from '@/lib/fetch';
import { getServerSession, Session } from 'next-auth';
import { getSession } from 'next-auth/react';

class StoreData implements IStoreData {
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

  async getStore(): Promise<Store | null> {
    const session = await this.getAuthSession();
    const response = await fetchJSON(`${APP_URL}/apis/store`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (response && response.data) {
      return response.data;
    }

    return null;
  }

  async updateStore(data: Partial<Store>): Promise<Store | null> {
    const session = await this.getAuthSession();
    const response = await fetchJSON(`${APP_URL}/apis/store`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response && response.data) {
      return response.data;
    }

    return null;
  }
}

export default StoreData;
