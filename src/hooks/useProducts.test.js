import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useProducts from './useProducts';
import { jsonResponse, mockFetch, products } from '../test/utils';

describe('useProducts', () => {
  it('спочатку повертає порожній список і loading', () => {
    mockFetch(() => jsonResponse(products));
    const { result } = renderHook(() => useProducts());
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('повертає товари після завантаження', async () => {
    mockFetch(() => jsonResponse(products));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.products).toHaveLength(3));
    expect(result.current.error).toBeNull();
  });

  it('повертає помилку', async () => {
    mockFetch(() => jsonResponse({ message: 'Збій' }, 500));
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.error).toBe('Збій'));
    expect(result.current.products).toEqual([]);
  });
});
