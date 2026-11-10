import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from './ProductCard';
import { useCart } from '../../context/CartContext';
import { renderWithProviders } from '../../test/utils';

const product = { id: 'cake', emoji: '🎂', title: 'Медовик', desc: '1 кг', price: 420 };

function CartInfo() {
  const { count, total } = useCart();
  return <p data-testid="info">{`${count}/${total}`}</p>;
}

describe('ProductCard', () => {
  it('показує назву, опис і ціну', () => {
    renderWithProviders(<ProductCard {...product} />);
    expect(screen.getByText('Медовик')).toBeInTheDocument();
    expect(screen.getByText('1 кг')).toBeInTheDocument();
    expect(screen.getByText('420 ₴')).toBeInTheDocument();
  });

  it('має посилання на сторінку товару', () => {
    renderWithProviders(<ProductCard {...product} />);
    screen.getAllByRole('link').forEach((a) => expect(a).toHaveAttribute('href', '/catalog/cake'));
  });

  it('кнопка «+» додає товар у кошик', async () => {
    renderWithProviders(
      <>
        <ProductCard {...product} />
        <CartInfo />
      </>
    );
    expect(screen.getByTestId('info')).toHaveTextContent('0/0');
    await userEvent.click(screen.getByRole('button', { name: 'Додати в кошик: Медовик' }));
    await userEvent.click(screen.getByRole('button', { name: 'Додати в кошик: Медовик' }));
    expect(screen.getByTestId('info')).toHaveTextContent('2/840');
  });
});
