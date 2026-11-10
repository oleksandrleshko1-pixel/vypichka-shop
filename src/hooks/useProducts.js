import useFetch from './useFetch';
import { PRODUCTS_API } from '../api/config';

// Список товарів із сервера.
export default function useProducts() {
  const { data, loading, error } = useFetch(PRODUCTS_API);
  return { products: data ?? [], loading, error };
}
