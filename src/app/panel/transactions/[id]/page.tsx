import { transactionDataServer } from '@/data/transaction';
import { TransactionDetailContainer } from './container';
import { notFound } from 'next/navigation';

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await transactionDataServer.getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return <TransactionDetailContainer transaction={transaction} />;
}
