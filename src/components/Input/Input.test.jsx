import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('показує placeholder', () => {
    render(<Input placeholder="Ім'я" />);
    expect(screen.getByPlaceholderText("Ім'я")).toBeInTheDocument();
  });

  it('викликає onChange при введенні', async () => {
    const onChange = vi.fn();
    render(<Input placeholder="x" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText('x'), 'abc');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('передає type', () => {
    render(<Input type="password" placeholder="p" />);
    expect(screen.getByPlaceholderText('p')).toHaveAttribute('type', 'password');
  });
});
