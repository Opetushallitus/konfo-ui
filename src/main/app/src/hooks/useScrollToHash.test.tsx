import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { render, screen, waitFor } from '#/src/test-utils';

import { useScrollToHash } from './useScrollToHash';

const TestPage = () => {
  useScrollToHash();

  return <h2 id="ammatillinen-perustutkinto">Ammatillinen perustutkinto</h2>;
};

describe('useScrollToHash', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  test('moves focus to the hash target after scrolling', async () => {
    render(
      <MemoryRouter initialEntries={['/fi/sivu#ammatillinen-perustutkinto']}>
        <TestPage />
      </MemoryRouter>
    );

    const heading = screen.getByRole('heading', {
      name: 'Ammatillinen perustutkinto',
    });

    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
    });
  });
});
