import { Transaction } from '@/domain/model/transaction';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Store } from '@/domain/model/store';

interface MiniReceiptProps {
  transaction: Transaction;
  store: Store;
}

export const MiniReceipt = ({ transaction, store }: MiniReceiptProps) => {
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
        <h1 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{store.name}</h1>
        <p style={{ margin: 0 }}>{store.address}</p>
        <p style={{ margin: 0 }}>Telp: {store.phone}</p>
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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Subtotal</span>
        <span>{formatCurrency(transaction.sub_total)}</span>
      </div>

      {transaction.coupons && transaction.coupons.length > 0 && (
        <>
          <span>Voucher</span>
          {transaction.coupons.map((coupon, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>({coupon.code.code})</span>
              <span>
                -
                {formatCurrency(
                  coupon.type === 'voucher'
                    ? coupon.voucher_value || 0
                    : (transaction.sub_total * (coupon.discount_percentage || 0)) / 100,
                )}
              </span>
            </div>
          ))}
        </>
      )}

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

      {transaction.note && (
        <>
          <div style={{ marginBottom: '5px' }}>
            <span style={{ fontWeight: 'bold' }}>Catatan:</span>
            <p style={{ margin: 0 }}>{transaction.note}</p>
          </div>
          <div style={{ borderBottom: '1px dashed black', margin: '10px 0' }} />
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ margin: 0 }}>Terima Kasih</p>
        <p style={{ margin: 0 }}>Selamat Belanja Kembali</p>
      </div>
    </div>
  );
};
