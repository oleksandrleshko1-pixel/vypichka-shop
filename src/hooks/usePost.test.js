import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import usePost from './usePost';
import { jsonResponse, mockFetch } from '../test/utils';

describe('usePost', () => {
  it('надсилає JSON і повертає відповідь', async () => {
    const fetchMock = mockFetch(() => jsonResponse({ id: 5 }, 201));
    const { result } = renderHook(() => usePost('/orders'));
    let data;
    await act(async () => {
      data = await result.current.post({ a: 1 });
    });
    expect(data).toEqual({ id: 5 });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('/orders');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers.Authorization).toBeUndefined();
    expect(JSON.parse(options.body)).toEqual({ a: 1 });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('додає токен', async () => {
    const fetchMock = mockFetch(() => jsonResponse({}));
    const { result } = renderHook(() => usePost('/orders'));
    await act(async () => {
      await result.current.post({}, 'tok');
    });
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer tok');
  });

  it('повертає null і помилку сервера', async () => {
    mockFetch(() => jsonResponse({ message: 'Некоректні дані' }, 400));
    const { result } = renderHook(() => usePost('/orders'));
    let data;
    await act(async () => {
      data = await result.current.post({});
    });
    expect(data).toBeNull();
    expect(result.current.error).toBe('Некоректні дані');
  });

  it('повертає статус, якщо тіла відповіді немає', async () => {
    mockFetch(() => ({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('no body');
      },
    }));
    const { result } = renderHook(() => usePost('/orders'));
    await act(async () => {
      await result.current.post({});
    });
    expect(result.current.error).toBe('Помилка сервера: 502');
  });

  it('повідомляє, що сервер недоступний', async () => {
    mockFetch(() => {
      throw new TypeError('Failed to fetch');
    });
    const { result } = renderHook(() => usePost('/orders'));
    await act(async () => {
      await result.current.post({});
    });
    expect(result.current.error).toMatch(/Сервер недоступний/);
  });
});
