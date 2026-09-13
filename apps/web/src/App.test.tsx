import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App.js';

describe('App', () => {
  it('renders the application foundation heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'E-commerce' })).toBeInTheDocument();
  });
});
