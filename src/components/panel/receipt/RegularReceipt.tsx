import { Transaction } from '@/domain/model/transaction';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Store } from '@/domain/model/store';

interface RegularReceiptProps {
  transaction: Transaction;
  store: Store;
}

export const RegularReceipt = ({ transaction, store }: RegularReceiptProps) => {
  const total = transaction.total;
  const change = (transaction.pay || 0) - total;

  return (
    <div
      style={{
        width: '210mm', // A4 width
        padding: '20mm',
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{store.name}</h1>
          <p style={{ margin: '5px 0', whiteSpace: 'pre-line' }}>{store.address}</p>
          <p style={{ margin: 0 }}>Telp: {store.phone}</p>
          {store.email && <p style={{ margin: 0 }}>Email: {store.email}</p>}
          {store.site && <p style={{ margin: 0 }}>Website: {store.site}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>INVOICE</h2>
          <p style={{ margin: '5px 0' }}>#{transaction.code || transaction.id}</p>
          <p style={{ margin: 0 }}>
            {format(new Date(transaction.created_at), 'dd MMMM yyyy HH:mm')}
          </p>
        </div>
      </div>

      <div style={{ borderBottom: '2px solid #eee', marginBottom: '20px' }} />

      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <strong>Kasir:</strong> {transaction.cashier?.name || 'Cashier'}
        </div>
        <div>
          <strong>Metode Pembayaran:</strong> {transaction.payment}
        </div>
      </div>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #000' }}>
            <th style={{ textAlign: 'left', padding: '10px 0' }}>Produk</th>
            <th style={{ textAlign: 'right', padding: '10px 0' }}>Harga</th>
            <th style={{ textAlign: 'center', padding: '10px 0' }}>Jumlah</th>
            <th style={{ textAlign: 'right', padding: '10px 0' }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {transaction.items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 0' }}>
                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.sku_code}</div>
              </td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>
                {formatCurrency(item.unit_price)}
              </td>
              <td style={{ textAlign: 'center', padding: '10px 0' }}>{item.amount}</td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>
                {formatCurrency(item.amount * item.unit_price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div style={{ borderBottom: '1px solid #eee', margin: '10px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Bayar</span>
            <span>{formatCurrency(transaction.pay || 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Kembali</span>
            <span>{formatCurrency(change)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '50px', textAlign: 'center', color: '#666', fontSize: '12px' }}>
        <p>Terima kasih telah berbelanja di UMS Store.</p>
      </div>
    </div>
  );
};
