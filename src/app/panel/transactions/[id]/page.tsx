import { transactionDataServer } from '@/data/transaction';
import { TransactionDetailContainer } from './container';
import { notFound } from 'next/navigation';
import StoreData from '@/data/store';
import { NotFoundDisplay } from '@/components/display/NotFoundDisplay';

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await transactionDataServer.getTransaction(id);
  const storeData = new StoreData(true);
  const store = await storeData.getStore();

  if (!transaction) {
    return notFound();
  }

  if (!store) {
    return <NotFoundDisplay message="Data toko tidak ditemukan, silahkan isi terlebih dahulu." />;
  }

  return <TransactionDetailContainer transaction={transaction} store={store} />;
}
