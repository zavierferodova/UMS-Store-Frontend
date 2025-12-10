import { Store } from '../model/store';

export interface IStoreData {
  getStore(): Promise<Store | null>;
  updateStore(data: Partial<Store>): Promise<Store | null>;
}
