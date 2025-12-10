import StoreData from '@/data/store';
import StoreForm from './form';

export default async function StorePage() {
  const storeData = new StoreData(true);
  const store = await storeData.getStore();

  return <StoreForm store={store} />;
}
