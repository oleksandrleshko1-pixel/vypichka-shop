import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { renderWithProviders } from '../../test/utils';

describe('Layout', () => {
  it('рендерить шапку та вкладений маршрут', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Вміст сторінки</p>} />
        </Route>
      </Routes>
    );
    expect(screen.getByText('Крафтова випічка')).toBeInTheDocument();
    expect(screen.getByText('Вміст сторінки')).toBeInTheDocument();
  });
});
