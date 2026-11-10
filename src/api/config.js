// Адреса нашого node/express сервера (папка server/).
// За потреби її можна змінити через змінну VITE_API_URL.
export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

export const PRODUCTS_API = `${API}/products`;
export const ORDERS_API = `${API}/orders`;
export const LOGIN_API = `${API}/auth/login`;
export const REGISTER_API = `${API}/auth/register`;
