'use client';

import { useController } from './controller';
import { ProductList } from './components/ProductList';
import { Cart } from './components/Cart';
import { SpinAnimation } from '@/components/animation/SpinAnimation';
import { usePanelHeader } from '@/components/panel/Header';
import { useEffect } from 'react';
import { panelRoutes } from '@/routes/route';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { ReceiptDialog } from './components/ReceiptDialog';
import { Store } from '@/domain/model/store';

interface CashierContainerProps {
  store: Store;
  cashierBookId: string;
}

export default function CashierContainer({ store, cashierBookId }: CashierContainerProps) {
  const {
    status,
    products,
    loading,
    search,
    page,
    hasMore,
    cart,
    subTotal,
    total,
    discountTotal,
    remainingDiscount,
    savedTransactions,
    savedTransactionsLoading,
    lastSuccessfulTransaction,
    currentTransaction,
    coupons,
    couponLoading,
    setSearch,
    handleLoadMore,
    addToCart,
    updateQuantity,
    handleConfirmPayment,
    handleSaveTransaction,
    fetchSavedTransactions,
    restoreTransaction,
    clearTransactionState,
    clearLastSuccessfulTransaction,
    checkCoupon,
    removeCoupon,
  } = useController(cashierBookId);
  const { setMenu } = usePanelHeader();

  useEffect(() => {
    setMenu([
      {
        name: 'Beranda',
        href: panelRoutes.home,
      },
      {
        name: 'Kasir',
        href: '#',
      },
    ]);
  }, [setMenu]);

  if (status === 'loading') {
    return <SpinAnimation />;
  }

  return (
    <div className="flex flex-col gap-6 overflow-hidden lg:h-[88vh] lg:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <ProductList
          search={search}
          onSearchChange={setSearch}
          loading={loading}
          page={page}
          products={products}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onAddToCart={addToCart}
        />
      </div>
      <div className="hidden h-[95vh] w-full shrink-0 lg:h-full xl:block xl:w-95">
        <Cart
          className="border"
          cart={cart}
          subTotal={subTotal}
          total={total}
          discountTotal={discountTotal}
          remainingDiscount={remainingDiscount}
          coupons={coupons}
          couponLoading={couponLoading}
          checkCoupon={checkCoupon}
          removeCoupon={removeCoupon}
          onUpdateQuantity={updateQuantity}
          onSaveTransaction={handleSaveTransaction}
          onConfirmPayment={handleConfirmPayment}
          savedTransactions={savedTransactions}
          savedTransactionsLoading={savedTransactionsLoading}
          onRestoreTransaction={restoreTransaction}
          onFetchSavedTransactions={fetchSavedTransactions}
          currentTransactionCode={currentTransaction?.code || null}
          onClearTransaction={clearTransactionState}
        />
      </div>

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed right-4 bottom-4 z-50 h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="border-background absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-red-500 text-xs font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-none p-0 sm:max-w-md">
            <SheetTitle className="sr-only">Cart</SheetTitle>
            <div className="h-full pt-10">
              <Cart
                cart={cart}
                subTotal={subTotal}
                total={total}
                discountTotal={discountTotal}
                coupons={coupons}
                couponLoading={couponLoading}
                checkCoupon={checkCoupon}
                removeCoupon={removeCoupon}
                onUpdateQuantity={updateQuantity}
                onSaveTransaction={handleSaveTransaction}
                onConfirmPayment={handleConfirmPayment}
                savedTransactions={savedTransactions}
                savedTransactionsLoading={savedTransactionsLoading}
                onRestoreTransaction={restoreTransaction}
                onFetchSavedTransactions={fetchSavedTransactions}
                currentTransactionCode={currentTransaction?.code || null}
                onClearTransaction={clearTransactionState}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ReceiptDialog
        open={!!lastSuccessfulTransaction}
        onOpenChange={(open) => {
          if (!open) clearLastSuccessfulTransaction();
        }}
        transaction={lastSuccessfulTransaction}
        store={store}
      />
    </div>
  );
}
