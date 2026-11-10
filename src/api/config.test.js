import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('api/config', () => {
  it('за замовчуванням використовує localhost:3001', async () => {
    vi.stubEnv('VITE_API_URL', undefined);
    vi.resetModules();
    const cfg = await import('./config');
    expect(cfg.API).toBe('http://localhost:3001/api');
    expect(cfg.PRODUCTS_API).toBe('http://localhost:3001/api/products');
    expect(cfg.ORDERS_API).toBe('http://localhost:3001/api/orders');
    expect(cfg.LOGIN_API).toBe('http://localhost:3001/api/auth/login');
    expect(cfg.REGISTER_API).toBe('http://localhost:3001/api/auth/register');
  });

  it('бере адресу зі змінної VITE_API_URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://example.com/api');
    vi.resetModules();
    const cfg = await import('./config');
    expect(cfg.PRODUCTS_API).toBe('https://example.com/api/products');
  });
});
