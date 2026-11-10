import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Home from './Home';
import { jsonResponse, mockFetch, productsFetch, renderWithProviders } from '../../test/utils';

describe('Home', () => {
  it('показує головний блок і категорії', () => {
    productsFetch();
    renderWithProviders(<Home />);
    expect(screen.getByText('Свіжа випічка до вашого столу')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Зробити замовлення' })).toHaveAttribute('href', '/catalog');
    ['Усе', 'Торти', 'Тістечка', 'Хліб', 'Печиво'].forEach((c) =>
      expect(screen.getByRole('button', { name: c })).toBeInTheDocument()
    );
  });

  it('показує завантаження, потім лише новинки', async () => {
    productsFetch();
    renderWithProviders(<Home />);
    expect(screen.getByText('Завантаження…')).toBeInTheDocument();
    expect(await screen.findByText('Медовик')).toBeInTheDocument();
    expect(screen.getByText('Макарон')).toBeInTheDocument();
    expect(screen.queryByText('Багет')).not.toBeInTheDocument();
  });

  it('показує помилку завантаження', async () => {
    mockFetch(() => jsonResponse({ message: 'Збій' }, 500));
    renderWithProviders(<Home />);
    expect(await screen.findByText(/Не вдалося завантажити товари: Збій/)).toBeInTheDocument();
  });
});
