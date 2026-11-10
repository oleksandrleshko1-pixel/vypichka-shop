import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { jsonResponse, mockFetch } from '../test/utils';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
const session = { user: { id: 1, name: 'Олена', email: 'o@o.ua' }, token: 'tok' };

describe('AuthContext', () => {
  it('кидає помилку поза провайдером', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(/AuthProvider/);
  });

  it('спочатку користувача немає', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('login зберігає користувача з токеном', async () => {
    const fetchMock = mockFetch(() => jsonResponse(session));
    const { result } = renderHook(() => useAuth(), { wrapper });
    let ok;
    await act(async () => {
      ok = await result.current.login('o@o.ua', '123456');
    });
    expect(ok).toBe(true);
    expect(result.current.user).toEqual({ id: 1, name: 'Олена', email: 'o@o.ua', token: 'tok' });
    expect(JSON.parse(localStorage.getItem('vypichka-auth-v2')).token).toBe('tok');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: 'o@o.ua', password: '123456' });
  });

  it('login повертає false і помилку при невдалому вході', async () => {
    mockFetch(() => jsonResponse({ message: 'Невірний пароль' }, 401));
    const { result } = renderHook(() => useAuth(), { wrapper });
    let ok;
    await act(async () => {
      ok = await result.current.login('o@o.ua', 'x');
    });
    expect(ok).toBe(false);
    expect(result.current.user).toBeNull();
    await waitFor(() => expect(result.current.loginError).toBe('Невірний пароль'));
  });

  it('register створює акаунт і входить', async () => {
    const fetchMock = mockFetch(() => jsonResponse(session, 201));
    const { result } = renderHook(() => useAuth(), { wrapper });
    let ok;
    await act(async () => {
      ok = await result.current.register({ name: 'Олена', email: 'o@o.ua', password: '123456' });
    });
    expect(ok).toBe(true);
    expect(result.current.user.name).toBe('Олена');
    expect(fetchMock.mock.calls[0][0]).toMatch(/auth\/register$/);
  });

  it('register повертає false при помилці', async () => {
    mockFetch(() => jsonResponse({ message: 'Пошта вже використовується' }, 409));
    const { result } = renderHook(() => useAuth(), { wrapper });
    let ok;
    await act(async () => {
      ok = await result.current.register({ name: 'a', email: 'a@a.ua', password: '123456' });
    });
    expect(ok).toBe(false);
    await waitFor(() => expect(result.current.registerError).toBe('Пошта вже використовується'));
  });

  it('logout очищає користувача і localStorage', () => {
    localStorage.setItem('vypichka-auth-v2', JSON.stringify({ ...session.user, token: 'tok' }));
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user.name).toBe('Олена');
    act(() => result.current.logout());
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('vypichka-auth-v2')).toBeNull();
  });

  it('ігнорує пошкоджені дані в localStorage', () => {
    localStorage.setItem('vypichka-auth-v2', '{не json');
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('працює, якщо localStorage недоступний для запису', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    mockFetch(() => jsonResponse(session));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      await result.current.login('o@o.ua', '123456');
    });
    expect(result.current.user.name).toBe('Олена');
  });
});
