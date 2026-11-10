import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
const cake = { id: 'cake', emoji: '🎂', title: 'Медовик', price: 100 };
const bread = { id: 'bread', emoji: '🍞', title: 'Багет', price: 40 };

describe('CartContext', () => {
  it('кидає помилку поза провайдером', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/);
  });

  it('спочатку кошик порожній', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('addItem додає товар, а повторне додавання збільшує кількість', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(cake));
    act(() => result.current.addItem(cake));
    act(() => result.current.addItem(bread));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].qty).toBe(2);
    expect(result.current.count).toBe(3);
    expect(result.current.total).toBe(240);
  });

  it('повторне додавання не чіпає інші товари в кошику', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(cake));
    act(() => result.current.addItem(bread));
    act(() => result.current.addItem(cake));
    expect(result.current.items.find((i) => i.id === 'cake').qty).toBe(2);
    expect(result.current.items.find((i) => i.id === 'bread').qty).toBe(1);
  });

  it('changeQty змінює кількість і видаляє товар на нулі', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(cake));
    act(() => result.current.changeQty('cake', 2));
    expect(result.current.items[0].qty).toBe(3);
    act(() => result.current.changeQty('cake', -3));
    expect(result.current.items).toEqual([]);
  });

  it('removeItem і clear видаляють товари', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(cake);
      result.current.addItem(bread);
    });
    act(() => result.current.removeItem('cake'));
    expect(result.current.items.map((i) => i.id)).toEqual(['bread']);
    act(() => result.current.clear());
    expect(result.current.items).toEqual([]);
  });

  it('зберігає кошик у localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(cake));
    expect(JSON.parse(localStorage.getItem('vypichka-cart'))).toHaveLength(1);
  });

  it('читає кошик із localStorage', () => {
    localStorage.setItem('vypichka-cart', JSON.stringify([{ ...cake, qty: 4 }]));
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.count).toBe(4);
  });

  it('ігнорує пошкоджені дані в localStorage', () => {
    localStorage.setItem('vypichka-cart', '{не json');
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
  });

  it('ігнорує дані, що не є масивом', () => {
    localStorage.setItem('vypichka-cart', JSON.stringify({ a: 1 }));
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
  });

  it('працює, якщо localStorage недоступний для запису', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(cake));
    expect(result.current.count).toBe(1);
  });
});
