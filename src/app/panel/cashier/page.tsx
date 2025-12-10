import StoreData from '@/data/store';
import CashierContainer from './container';
import { NotFoundDisplay } from '@/components/display/NotFoundDisplay';

export default async function CashierPage() {
  const storeData = new StoreData(true);
  const store = await storeData.getStore();

  if (!store) {
    return <NotFoundDisplay message="Data toko tidak ditemukan, silahkan isi terlebih dahulu." />;
  }

  return <CashierContainer store={store} />;
}
