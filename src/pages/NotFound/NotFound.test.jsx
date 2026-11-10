import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NotFound from './NotFound';
import { renderWithProviders } from '../../test/utils';

describe('NotFound', () => {
  it('показує 404 і посилання на головну', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Сторінку не знайдено')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'На головну' })).toHaveAttribute('href', '/');
  });
});
