import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('показує текст', () => {
    render(<Button>Натисни</Button>);
    expect(screen.getByRole('button', { name: 'Натисни' })).toBeInTheDocument();
  });

  it('викликає onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ок</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('передає додаткові атрибути (disabled, type)', () => {
    render(
      <Button disabled type="submit">
        Ок
      </Button>
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('приймає variant', () => {
    render(<Button variant="accent">Ок</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
