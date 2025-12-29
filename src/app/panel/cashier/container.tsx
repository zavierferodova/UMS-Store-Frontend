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
}

export default function CashierContainer({ store }: CashierContainerProps) {
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
  } = useController();
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
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[88vh] overflow-hidden">
      <div className="flex-1 min-w-0 overflow-y-auto">
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
      <div className="hidden xl:block h-[95vh] lg:h-full w-full xl:w-[380px] shrink-0">
        <Cart
          className="border"
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

      <div className="xl:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
              size="icon"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 border-none">
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
