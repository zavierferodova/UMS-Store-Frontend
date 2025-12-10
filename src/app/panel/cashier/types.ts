import { ProductSingleSKU } from '@/domain/model/product';

export interface CartItem extends ProductSingleSKU {
  amount: number;
}
