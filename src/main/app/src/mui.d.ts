/* eslint-disable @typescript-eslint/no-empty-interface */

import { PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    headerHeight: number;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    headerHeight?: number;
  }

  interface CustomPalette {
    inverted: PaletteColor;
  }

  interface CustomPaletteOptions {
    inverted: PaletteColorOptions;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPaletteOptions {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    inverted: true;
  }
}
