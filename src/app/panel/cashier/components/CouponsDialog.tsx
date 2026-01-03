import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, TicketIcon, XIcon } from 'lucide-react';
import { CheckCouponCodeUsageResponse } from '@/domain/data/coupon';
import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CouponType } from '@/domain/model/coupon';

interface CouponsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupons: CheckCouponCodeUsageResponse[];
  loading: boolean;
  onCheckCoupon: (code: string) => void;
  onRemoveCoupon: (code: string) => void;
  subTotal?: number;
}

export function CouponsDialog({
  open,
  onOpenChange,
  coupons,
  loading,
  onCheckCoupon,
  onRemoveCoupon,
  subTotal,
}: CouponsDialogProps) {
  const [couponCode, setCouponCode] = useState('');

  const handleCheck = () => {
    if (couponCode) {
      onCheckCoupon(couponCode);
      setCouponCode('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Kupon</DialogTitle>
          <DialogDescription>
            Masukkan kode kupon untuk mendapatkan potongan harga.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="Kode Kupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && couponCode && !loading) {
                  handleCheck();
                }
              }}
            />
            <Button
              className="cursor-pointer"
              onClick={handleCheck}
              disabled={!couponCode || loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gunakan'}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Kupon Terpasang ({coupons.length})</h4>
            {coupons.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada kupon yang digunakan.</p>
            ) : (
              <div className="space-y-2">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.code.code}
                    className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-100"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <TicketIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-900">{coupon.name}</p>
                        <p className="text-xs text-green-700">
                          {coupon.code.code} •{' '}
                          {coupon.type === CouponType.voucher
                            ? formatCurrency(coupon.voucher_value || 0)
                            : `${coupon.discount_percentage}%${
                                subTotal && subTotal > 0
                                  ? ` (${formatCurrency(
                                      (subTotal * (coupon.discount_percentage || 0)) / 100,
                                    )})`
                                  : ''
                              }`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-700 hover:text-green-800 hover:bg-green-100"
                      onClick={() => onRemoveCoupon(coupon.code.code)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
