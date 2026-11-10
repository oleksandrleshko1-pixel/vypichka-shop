import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './ProductPage';
import { useCart } from '../../context/CartContext';
import { jsonResponse, mockFetch, productsFetch, renderWithProviders } from '../../test/utils';

function CartCount() {
  const { count } = useCart();
  return <p data-testid="count">{count}</p>;
}

const renderAt = (route) =>
  renderWithProviders(
    <>
      <Routes>
        <Route path="/catalog/:id" element={<ProductPage />} />
      </Routes>
      <CartCount />
    </>,
    { route }
  );

describe('ProductPage', () => {
  it('показує завантаження', () => {
    productsFetch();
    renderAt('/catalog/cake');
    expect(screen.getByText('Завантаження…')).toBeInTheDocument();
  });

  it('показує товар за id', async () => {
    productsFetch();
    renderAt('/catalog/cake');
    expect(await screen.findByRole('heading', { name: 'Медовик' })).toBeInTheDocument();
    expect(screen.getByText('420 ₴')).toBeInTheDocument();
    expect(screen.getByText('1 кг')).toBeInTheDocument();
  });

  it('додає товар у кошик і показує підтвердження', async () => {
    productsFetch();
    renderAt('/catalog/cake');
    await userEvent.click(await screen.findByRole('button', { name: 'Додати в кошик' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByText(/Додано!/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти в кошик' })).toHaveAttribute('href', '/cart');
  });

  it('показує «Товар не знайдено» для невідомого id', async () => {
    productsFetch();
    renderAt('/catalog/unknown');
    expect(await screen.findByText('Товар не знайдено')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Назад до каталогу/ })).toHaveAttribute('href', '/catalog');
  });

  it('показує помилку завантаження', async () => {
    mockFetch(() => jsonResponse({ message: 'Збій' }, 500));
    renderAt('/catalog/cake');
    expect(await screen.findByText('Не вдалося завантажити товар')).toBeInTheDocument();
  });
});
