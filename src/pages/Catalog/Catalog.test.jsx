import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Catalog from './Catalog';
import { jsonResponse, mockFetch, productsFetch, renderWithProviders } from '../../test/utils';

const titles = () =>
  screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent).filter((t) =>
    ['Медовик', 'Багет', 'Макарон'].includes(t)
  );

describe('Catalog', () => {
  it('показує всі товари та їх кількість', async () => {
    productsFetch();
    renderWithProviders(<Catalog />);
    expect(screen.getByText('Завантаження…')).toBeInTheDocument();
    expect(await screen.findByText('Медовик')).toBeInTheDocument();
    expect(screen.getByText('Знайдено · 3 товарів')).toBeInTheDocument();
  });

  it('фільтрує за категорією', async () => {
    productsFetch();
    renderWithProviders(<Catalog />);
    await screen.findByText('Медовик');
    await userEvent.click(screen.getByRole('checkbox', { name: /Торти/ }));
    expect(screen.queryByText('Медовик')).not.toBeInTheDocument();
    expect(screen.getByText('Знайдено · 2 товарів')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox', { name: /Торти/ }));
    expect(screen.getByText('Медовик')).toBeInTheDocument();
  });

  it('показує «Нічого не знайдено», якщо знято всі категорії', async () => {
    productsFetch();
    renderWithProviders(<Catalog />);
    await screen.findByText('Медовик');
    for (const name of [/Торти/, /Тістечка/, /Хліб/, /Печиво/]) {
      await userEvent.click(screen.getByRole('checkbox', { name }));
    }
    expect(screen.getByText('Нічого не знайдено.')).toBeInTheDocument();
  });

  it('сортує за ціною', async () => {
    productsFetch();
    renderWithProviders(<Catalog />);
    await screen.findByText('Медовик');
    const select = screen.getByLabelText('Сортування');

    await userEvent.selectOptions(select, 'priceAsc');
    expect(titles()).toEqual(['Багет', 'Макарон', 'Медовик']);

    await userEvent.selectOptions(select, 'priceDesc');
    expect(titles()).toEqual(['Медовик', 'Макарон', 'Багет']);

    await userEvent.selectOptions(select, 'popular');
    expect(titles()).toHaveLength(3);
  });

  it('показує блок фільтрів', async () => {
    productsFetch();
    renderWithProviders(<Catalog />);
    await screen.findByText('Медовик');
    const diet = screen.getByRole('heading', { name: 'Дієта та алергени' }).closest('section');
    expect(within(diet).getAllByRole('checkbox')).toHaveLength(3);
  });

  it('показує помилку завантаження', async () => {
    mockFetch(() => jsonResponse({ message: 'Збій' }, 500));
    renderWithProviders(<Catalog />);
    expect(await screen.findByText(/Не вдалося завантажити товари: Збій/)).toBeInTheDocument();
  });
});
