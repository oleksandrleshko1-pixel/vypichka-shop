import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

export const products = [
  { id: 'cake', category: 'cakes', emoji: '🎂', title: 'Медовик', desc: '1 кг', price: 420, isNew: true },
  { id: 'bread', category: 'bread', emoji: '🍞', title: 'Багет', desc: '300 г', price: 60, isNew: false },
  { id: 'cookie', category: 'cookies', emoji: '🍪', title: 'Макарон', desc: '6 шт', price: 150, isNew: true },
];

// Імітація відповіді fetch
export const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

// Підміняє глобальний fetch; handler(url, options) повертає відповідь
export function mockFetch(handler) {
  const fn = vi.fn(async (url, options) => handler(String(url), options));
  vi.stubGlobal('fetch', fn);
  return fn;
}

export const productsFetch = () =>
  mockFetch(() => jsonResponse(products));

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}
