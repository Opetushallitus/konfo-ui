/* eslint-disable @typescript-eslint/no-empty-interface */

import { PaletteColorOptions, Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    betaBannerHeight: number;
    headerHeight: number;
  }

  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    betaBannerHeight: number;
    headerHeight: number;
  }

  interface CustomPalette {
    inverted: PaletteColor;
  }

  interface CustomPaletteOptions {
    inverted: PaletteColorOptions;
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPaletteOptions {}

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    inverted: true;
  }
}
