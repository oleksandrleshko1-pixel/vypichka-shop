import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useFetch from './useFetch';
import { jsonResponse, mockFetch } from '../test/utils';

describe('useFetch', () => {
  it('завантажує дані', async () => {
    mockFetch(() => jsonResponse({ a: 1 }));
    const { result } = renderHook(() => useFetch('/x'));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ a: 1 });
    expect(result.current.error).toBeNull();
  });

  it('додає заголовок Authorization, якщо є токен', async () => {
    const fetchMock = mockFetch(() => jsonResponse([]));
    const { result } = renderHook(() => useFetch('/x', 'tok'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock.mock.calls[0][1].headers).toEqual({ Authorization: 'Bearer tok' });
  });

  it('без токена заголовка Authorization немає', async () => {
    const fetchMock = mockFetch(() => jsonResponse([]));
    const { result } = renderHook(() => useFetch('/x'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock.mock.calls[0][1].headers).toEqual({});
  });

  it('повертає повідомлення сервера при помилці', async () => {
    mockFetch(() => jsonResponse({ message: 'Немає доступу' }, 403));
    const { result } = renderHook(() => useFetch('/x'));
    await waitFor(() => expect(result.current.error).toBe('Немає доступу'));
    expect(result.current.data).toBeNull();
  });

  it('повертає статус, якщо тіла відповіді немає', async () => {
    mockFetch(() => ({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('no body');
      },
    }));
    const { result } = renderHook(() => useFetch('/x'));
    await waitFor(() => expect(result.current.error).toBe('Помилка сервера: 500'));
  });

  it('повідомляє, що сервер недоступний (мережева помилка)', async () => {
    mockFetch(() => {
      throw new TypeError('Failed to fetch');
    });
    const { result } = renderHook(() => useFetch('/x'));
    await waitFor(() => expect(result.current.error).toMatch(/Сервер недоступний/));
  });

  it('скасований запит не змінює стан', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    mockFetch(() => {
      throw abort;
    });
    const { result } = renderHook(() => useFetch('/x'));
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
