import React from 'react';

import { screen, render } from '#/src/test-utils';

import { Heading, HeadingBoundary } from './Heading';

test('Heading should throw error outside HeadingBoundary', () => {
  expect(() => render(<Heading>asdf</Heading>)).toThrow(
    'Heading used outside HeadingBoundary!'
  );
});

test('Heading levels should increase in nested heading boundaries', () => {
  render(
    <HeadingBoundary>
      <Heading>a</Heading>
      <HeadingBoundary>
        <Heading>b</Heading>
        <HeadingBoundary>
          <Heading>c</Heading>
          <HeadingBoundary>
            <Heading>d</Heading>
            <HeadingBoundary>
              <Heading>e</Heading>
              <HeadingBoundary>
                <Heading>f</Heading>
                <HeadingBoundary>
                  <Heading>g</Heading>
                </HeadingBoundary>
              </HeadingBoundary>
            </HeadingBoundary>
          </HeadingBoundary>
        </HeadingBoundary>
      </HeadingBoundary>
    </HeadingBoundary>
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('a');
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('b');
  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('c');
  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('d');
  expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent('e');
  expect(screen.getByRole('heading', { level: 6 })).toHaveTextContent('f');
  expect(screen.getByRole('heading', { level: 7 })).toHaveTextContent('g');
});
