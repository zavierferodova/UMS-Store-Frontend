import { Transaction } from '@/domain/model/transaction';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface MiniReceiptProps {
  transaction: Transaction;
}

export const MiniReceipt = ({ transaction }: MiniReceiptProps) => {
  const total = transaction.total;
  const change = (transaction.pay || 0) - total;

  return (
    <div
      style={{
        width: '58mm',
        fontFamily: 'monospace',
        fontSize: '12px',
        lineHeight: '1.2',
        padding: '10px',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>UMS Store</h1>
        <p style={{ margin: 0 }}>
          {' '}
          Jl. Garuda Mas, Gatak, Pabelan, Kec. Kartasura, Kabupaten Sukoharjo
        </p>
      </div>

      <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{format(new Date(transaction.created_at), 'dd/MM/yy HH:mm')}</span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <span>Kasir: {transaction.cashier?.name || 'Cashier'}</span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <span>ID: {transaction.code || transaction.id.slice(0, 8)}</span>
      </div>

      <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {transaction.items.map((item, index) => (
          <div key={index}>
            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                {item.amount} x {formatCurrency(item.unit_price)}
              </span>
              <span>{formatCurrency(item.amount * item.unit_price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Bayar ({transaction.payment})</span>
        <span>{formatCurrency(transaction.pay || 0)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Kembali</span>
        <span>{formatCurrency(change)}</span>
      </div>

      <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }} />

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ margin: 0 }}>Terima Kasih</p>
        <p style={{ margin: 0 }}>Selamat Belanja Kembali</p>
      </div>
    </div>
  );
};
