/* eslint react-refresh/only-export-components: "off" */
import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';

import { theme } from '#/src/theme';

const AllTheProviders = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
