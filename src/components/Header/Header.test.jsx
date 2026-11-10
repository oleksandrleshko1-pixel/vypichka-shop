import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from './Header';
import { renderWithProviders } from '../../test/utils';

describe('Header', () => {
  it('показує логотип і навігацію', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Крафтова випічка')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Каталог' })).toHaveAttribute('href', '/catalog');
  });

  it('показує «Профіль», якщо користувач не увійшов', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Профіль' })).toHaveAttribute('href', '/auth');
  });

  it("показує ім'я користувача після входу", () => {
    localStorage.setItem(
      'vypichka-auth-v2',
      JSON.stringify({ id: 1, name: 'Олена', email: 'o@o.ua', token: 't' })
    );
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: 'Олена' })).toBeInTheDocument();
  });

  it('показує кількість товарів у кошику', () => {
    localStorage.setItem(
      'vypichka-cart',
      JSON.stringify([{ id: 'a', emoji: '🎂', title: 'A', price: 10, qty: 3 }])
    );
    renderWithProviders(<Header />);
    expect(screen.getByRole('link', { name: /Кошик · 3/ })).toBeInTheDocument();
  });
});
