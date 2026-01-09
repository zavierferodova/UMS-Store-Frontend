import StoreData from '@/data/store';
import { CashierBookData } from '@/data/cashier-book';
import CashierContainer from './container';
import { NotFoundDisplay } from '@/components/display/NotFoundDisplay';

export default async function CashierPage() {
  const storeData = new StoreData(true);
  const store = await storeData.getStore();

  if (!store) {
    return (
      <NotFoundDisplay
        className="h-[75vh]"
        message="Data toko tidak ditemukan, silahkan isi terlebih dahulu."
      />
    );
  }

  const cashierBookData = new CashierBookData(true);
  const activeCashierBook = await cashierBookData.getActiveCashierBook();

  if (!activeCashierBook) {
    return (
      <NotFoundDisplay
        className="h-[75vh]"
        message="Buku kasir belum dibuka, silahkan buka buku kasir terlebih dahulu."
      />
    );
  }

  return <CashierContainer store={store} cashierBookId={activeCashierBook.id} />;
}
