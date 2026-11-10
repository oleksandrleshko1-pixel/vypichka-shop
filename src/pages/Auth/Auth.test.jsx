import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import { jsonResponse, mockFetch, renderWithProviders } from '../../test/utils';

const session = { user: { id: 1, name: 'Олена', email: 'o@o.ua' }, token: 'tok' };

const renderAuth = () =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Головна</p>} />
      <Route path="/auth" element={<Auth />} />
    </Routes>,
    { route: '/auth' }
  );

const fillRegister = async (over = {}) => {
  const v = { name: 'Олена', email: 'o@o.ua', password: '123456', repeat: '123456', agree: true, ...over };
  if (v.name) await userEvent.type(screen.getByPlaceholderText("Ім'я"), v.name);
  const emails = screen.getAllByPlaceholderText('Електронна пошта');
  if (v.email) await userEvent.type(emails[1], v.email);
  const pass = screen.getAllByPlaceholderText('Пароль');
  if (v.password) await userEvent.type(pass[1], v.password);
  if (v.repeat) await userEvent.type(screen.getByPlaceholderText('Повторіть пароль'), v.repeat);
  if (v.agree) await userEvent.click(screen.getByRole('checkbox'));
};

const clickRegister = () => userEvent.click(screen.getByRole('button', { name: 'Створити акаунт' }));

describe('Auth', () => {
  it('показує форми входу та реєстрації', () => {
    renderAuth();
    expect(screen.getByRole('heading', { name: 'Вхід' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Реєстрація' })).toBeInTheDocument();
  });

  it('вхід: успішний, переходить на головну', async () => {
    mockFetch(() => jsonResponse(session));
    renderAuth();
    const [email] = screen.getAllByPlaceholderText('Електронна пошта');
    const [pass] = screen.getAllByPlaceholderText('Пароль');
    await userEvent.type(email, 'o@o.ua');
    await userEvent.type(pass, '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Увійти' }));
    expect(await screen.findByText('Головна')).toBeInTheDocument();
  });

  it('вхід: показує помилку сервера', async () => {
    mockFetch(() => jsonResponse({ message: 'Невірний пароль' }, 401));
    renderAuth();
    await userEvent.type(screen.getAllByPlaceholderText('Електронна пошта')[0], 'o@o.ua');
    await userEvent.type(screen.getAllByPlaceholderText('Пароль')[0], 'xxxxxx');
    await userEvent.click(screen.getByRole('button', { name: 'Увійти' }));
    expect(await screen.findByText('Невірний пароль')).toBeInTheDocument();
  });

  it("реєстрація: вимагає ім'я", async () => {
    renderAuth();
    await clickRegister();
    expect(screen.getByText("Вкажіть ім'я")).toBeInTheDocument();
  });

  it('реєстрація: перевіряє пошту', async () => {
    renderAuth();
    await fillRegister({ email: 'a@b' });
    await clickRegister();
    expect(screen.getByText('Вкажіть коректну пошту')).toBeInTheDocument();
  });

  it('реєстрація: перевіряє довжину пароля', async () => {
    renderAuth();
    await fillRegister({ password: '123', repeat: '123' });
    await clickRegister();
    expect(screen.getByText('Пароль має містити щонайменше 6 символів')).toBeInTheDocument();
  });

  it('реєстрація: перевіряє збіг паролів', async () => {
    renderAuth();
    await fillRegister({ repeat: '654321' });
    await clickRegister();
    expect(screen.getByText('Паролі не збігаються')).toBeInTheDocument();
  });

  it('реєстрація: вимагає згоду', async () => {
    renderAuth();
    await fillRegister({ agree: false });
    await clickRegister();
    expect(screen.getByText('Потрібна згода з правилами сайту')).toBeInTheDocument();
  });

  it('реєстрація: успішна, переходить на головну', async () => {
    const fetchMock = mockFetch(() => jsonResponse(session, 201));
    renderAuth();
    await fillRegister();
    await clickRegister();
    expect(await screen.findByText('Головна')).toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      name: 'Олена',
      email: 'o@o.ua',
      password: '123456',
    });
  });

  it('реєстрація: показує помилку сервера', async () => {
    mockFetch(() => jsonResponse({ message: 'Пошта вже використовується' }, 409));
    renderAuth();
    await fillRegister();
    await clickRegister();
    expect(await screen.findByText('Пошта вже використовується')).toBeInTheDocument();
  });

  it('для авторизованого показує профіль і замовлення, вихід працює', async () => {
    localStorage.setItem('vypichka-auth-v2', JSON.stringify({ ...session.user, token: 'tok' }));
    mockFetch(() => jsonResponse([]));
    renderAuth();
    expect(screen.getByText('Ви увійшли')).toBeInTheDocument();
    expect(screen.getByText('o@o.ua')).toBeInTheDocument();
    expect(await screen.findByText('Замовлень поки немає.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Вийти' }));
    expect(screen.getByRole('heading', { name: 'Вхід' })).toBeInTheDocument();
  });
});
