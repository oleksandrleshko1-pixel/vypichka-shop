import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Cart from './Cart';
import { jsonResponse, mockFetch, renderWithProviders } from '../../test/utils';

const seedCart = () =>
  localStorage.setItem(
    'vypichka-cart',
    JSON.stringify([
      { id: 'cake', emoji: '🎂', title: 'Медовик', price: 420, qty: 2 },
      { id: 'bread', emoji: '🍞', title: 'Багет', price: 60, qty: 1 },
    ])
  );

const fillForm = async ({ name = 'Олена', phone = '+380501234567', address = 'вул. Мирна 1' } = {}) => {
  if (name) await userEvent.type(screen.getByPlaceholderText("Ім'я"), name);
  if (phone) await userEvent.type(screen.getByPlaceholderText('Телефон'), phone);
  if (address) await userEvent.type(screen.getByPlaceholderText('Адреса'), address);
};

const submit = () => userEvent.click(screen.getByRole('button', { name: 'Підтвердити замовлення' }));

describe('Cart', () => {
  it('показує порожній кошик', () => {
    renderWithProviders(<Cart />);
    expect(screen.getByText(/Кошик порожній\./)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Перейти до каталогу' })).toHaveAttribute('href', '/catalog');
  });

  it('показує товари та загальну суму', () => {
    seedCart();
    renderWithProviders(<Cart />);
    expect(screen.getByText('Медовик')).toBeInTheDocument();
    expect(screen.getByText('840 ₴')).toBeInTheDocument();
    expect(screen.getByText('900 ₴')).toBeInTheDocument();
  });

  it('змінює кількість і видаляє товар', async () => {
    seedCart();
    renderWithProviders(<Cart />);
    await userEvent.click(screen.getAllByRole('button', { name: 'Більше' })[1]);
    expect(screen.getByText('120 ₴')).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole('button', { name: 'Менше' })[1]);
    await userEvent.click(screen.getByRole('button', { name: 'Видалити: Медовик' }));
    expect(screen.queryByText('Медовик')).not.toBeInTheDocument();
    expect(screen.getByText('60 ₴ за шт.')).toBeInTheDocument();
  });

  it('перемикає доставку та самовивіз', async () => {
    renderWithProviders(<Cart />);
    expect(screen.getByPlaceholderText('Адреса')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Самовивіз' }));
    expect(screen.queryByPlaceholderText('Адреса')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Доставка' }));
    expect(screen.getByPlaceholderText('Адреса')).toBeInTheDocument();
  });

  it('валідація: порожній кошик', async () => {
    renderWithProviders(<Cart />);
    await submit();
    expect(screen.getByText('Кошик порожній')).toBeInTheDocument();
  });

  it("валідація: немає імені", async () => {
    seedCart();
    renderWithProviders(<Cart />);
    await submit();
    expect(screen.getByText("Вкажіть ім'я")).toBeInTheDocument();
  });

  it('валідація: некоректний телефон', async () => {
    seedCart();
    renderWithProviders(<Cart />);
    await fillForm({ phone: '12' });
    await submit();
    expect(screen.getByText('Вкажіть коректний телефон')).toBeInTheDocument();
  });

  it('валідація: немає адреси при доставці', async () => {
    seedCart();
    renderWithProviders(<Cart />);
    await fillForm({ address: '' });
    await submit();
    expect(screen.getByText('Вкажіть адресу доставки')).toBeInTheDocument();
  });

  it('відправляє замовлення, показує номер і чистить кошик', async () => {
    seedCart();
    const fetchMock = mockFetch(() => jsonResponse({ id: 101 }, 201));
    renderWithProviders(<Cart />);
    await userEvent.type(screen.getByPlaceholderText('Дата й час'), 'завтра 10:00');
    await userEvent.type(screen.getByPlaceholderText('Коментар до замовлення'), 'без цукру');
    await fillForm();
    await submit();

    expect(await screen.findByText('Дякуємо за замовлення!')).toBeInTheDocument();
    expect(screen.getByText(/№101/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'До каталогу' })).toHaveAttribute('href', '/catalog');

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.items).toEqual([
      { id: 'cake', qty: 2 },
      { id: 'bread', qty: 1 },
    ]);
    expect(body.customer).toEqual({ name: 'Олена', phone: '+380501234567' });
    expect(body.delivery).toBe(true);
    expect(JSON.parse(localStorage.getItem('vypichka-cart'))).toEqual([]);
  });

  it('самовивіз надсилає address = null', async () => {
    seedCart();
    const fetchMock = mockFetch(() => jsonResponse({ id: 7 }, 201));
    renderWithProviders(<Cart />);
    await userEvent.click(screen.getByRole('button', { name: 'Самовивіз' }));
    await fillForm({ address: '' });
    await submit();
    await screen.findByText('Дякуємо за замовлення!');
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.delivery).toBe(false);
    expect(body.address).toBeNull();
  });

  it('надсилає токен авторизованого користувача', async () => {
    seedCart();
    localStorage.setItem(
      'vypichka-auth-v2',
      JSON.stringify({ id: 1, name: 'Олена', email: 'o@o.ua', token: 'tok' })
    );
    const fetchMock = mockFetch(() => jsonResponse({ id: 8 }, 201));
    renderWithProviders(<Cart />);
    await fillForm();
    await submit();
    await screen.findByText('Дякуємо за замовлення!');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
  });

  it('показує помилку сервера і лишає кошик', async () => {
    seedCart();
    mockFetch(() => jsonResponse({ message: 'Товар недоступний' }, 400));
    renderWithProviders(<Cart />);
    await fillForm();
    await submit();
    expect(await screen.findByText('Товар недоступний')).toBeInTheDocument();
    expect(screen.getByText('Медовик')).toBeInTheDocument();
  });
});
