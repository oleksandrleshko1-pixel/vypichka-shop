import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { productsFetch } from './test/utils';

const renderApp = (route) => {
  productsFetch();
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('App (маршрути)', () => {
  it('/ — головна', () => {
    renderApp('/');
    expect(screen.getByText('Свіжа випічка до вашого столу')).toBeInTheDocument();
  });

  it('/catalog — каталог', () => {
    renderApp('/catalog');
    expect(screen.getByRole('heading', { name: 'Категорія' })).toBeInTheDocument();
  });

  it('/catalog/:id — сторінка товару', async () => {
    renderApp('/catalog/cake');
    expect(await screen.findByRole('heading', { name: 'Медовик' })).toBeInTheDocument();
  });

  it('/cart — кошик', () => {
    renderApp('/cart');
    expect(screen.getByText('Ваше замовлення')).toBeInTheDocument();
  });

  it('/auth — вхід і реєстрація', () => {
    renderApp('/auth');
    expect(screen.getByRole('heading', { name: 'Вхід' })).toBeInTheDocument();
  });

  it('невідомий шлях — 404', () => {
    renderApp('/nope');
    expect(screen.getByText('Сторінку не знайдено')).toBeInTheDocument();
  });

  it('шапка є на кожній сторінці', () => {
    renderApp('/nope');
    expect(screen.getByText('Крафтова випічка')).toBeInTheDocument();
  });
});
