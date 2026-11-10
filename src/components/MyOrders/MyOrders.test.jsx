import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyOrders from './MyOrders';
import { jsonResponse, mockFetch } from '../../test/utils';

describe('MyOrders', () => {
  it('показує завантаження, а потім замовлення', async () => {
    const fetchMock = mockFetch(() =>
      jsonResponse([
        {
          id: 101,
          createdAt: '2026-11-01T10:00:00.000Z',
          total: 900,
          items: [{ title: 'Медовик', qty: 2 }],
        },
      ])
    );
    render(<MyOrders token="abc" />);
    expect(screen.getByText('Завантаження…')).toBeInTheDocument();
    expect(await screen.findByText('№101')).toBeInTheDocument();
    expect(screen.getByText('Медовик × 2')).toBeInTheDocument();
    expect(screen.getByText('900 ₴')).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
  });

  it('показує повідомлення, якщо замовлень немає', async () => {
    mockFetch(() => jsonResponse([]));
    render(<MyOrders token="abc" />);
    expect(await screen.findByText('Замовлень поки немає.')).toBeInTheDocument();
  });

  it('показує помилку сервера', async () => {
    mockFetch(() => jsonResponse({ message: 'Потрібен вхід' }, 401));
    render(<MyOrders token="bad" />);
    expect(await screen.findByText('Потрібен вхід')).toBeInTheDocument();
  });
});
