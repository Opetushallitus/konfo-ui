import { createTheme } from '@material-ui/core/styles';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

import { colors } from './colors';

// Material UI theme customization
// Learn more: https://material-ui.com/customization/themes/

const breakpoints = {
  ...createBreakpoints({}),
  // Tämä toimii oletuksena material-ui:ssa todella hämmentävästi: esim. down('sm') palauttaa 'md'-breakpointista alaspäin.
  get down() {
    return (key) => `@media (max-width:${this.values[key] - 0.5}px)`;
  },
  get between() {
    return (keyA, keyB) =>
      `@media (min-width:${this.values[keyA]}px) and (max-width:${
        this.values[keyB] - 0.5
      }px)`;
  },
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600,
    xxl: 1920,
  },
};

export const getHeaderHeight =
  (theme) =>
  ({ betaBannerVisible, isSmall = false }) =>
    (isSmall ? theme.smHeaderHeight : theme.headerHeight) +
    (betaBannerVisible ? theme.betaBannerHeight : 0);

export const theme = createTheme({
  betaBannerHeight: 40,
  headerHeight: 64,
  smHeaderHeight: 54,
  breakpoints,
  palette: {
    primary: {
      main: colors.brandGreen,
    },
    secondary: {
      main: colors.brandGreen,
    },
    text: {
      primary: colors.darkGrey,
      secondary: colors.darkGrey,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: ['Open Sans', 'Arial', 'Roboto', 'sans-serif'],
    h1: {
      fontSize: '2.5rem',
      letterSpacing: '-0.09375rem',
      fontWeight: 700,
      color: colors.black,
      lineHeight: '3rem',
      marginBottom: '1.5rem',
      [breakpoints.down('sm')]: {
        fontSize: '2rem',
        letterSpacing: '-0.075rem',
        lineHeight: '2.375rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.black,
      lineHeight: '2.25rem',
      marginBottom: '1rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.75rem',
        lineHeight: '2rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: '2rem',
      marginBottom: '0.5rem',
      color: colors.black,
      [breakpoints.down('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '1.875rem',
      },
    },
    h4: {
      color: colors.black,
      fontSize: '1.5rem',
      fontWeight: '700',
      lineHeight: '1.75rem',
      marginBottom: '0.5rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.25rem',
        lineHeight: '1.5rem',
      },
    },
    h5: {
      color: colors.black,
      fontSize: '1.0rem',
      fontWeight: '700',
      lineHeight: '1.75rem',
      marginBottom: '0.25rem',
      [breakpoints.down('sm')]: {
        lineHeight: '1.5rem',
      },
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '16px',
      color: colors.black,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.6875rem',
      color: colors.darkGrey,
      [breakpoints.down('sm')]: {
        lineHeight: '1.6875rem',
      },
    },
  },

  overrides: {
    MuiAppBar: {
      root: {
        height: 70,
        marginBottom: 30,
        justifyContent: 'center',
        boxShadow:
          '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.1), 0px 2px 1px -1px rgba(0,0,0,0.1)',
      },
    },
    MuiButton: {
      containedPrimary: {
        color: 'white !important',
      },
    },
    MuiFormLabel: {
      root: {
        fontWeight: 'bold',
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: 12,
      },
      multiline: {
        padding: 12,
      },
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 12,
      },
    },
    MuiList: {
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiListItem: {
      dense: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      gutters: {
        paddingRight: '4px',
        paddingLeft: 0,
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 32,
      },
    },
    MuiListItemText: {
      primary: {
        width: '100%',
      },
    },
    MuiLink: {
      root: {
        cursor: 'pointer',
      },
    },
    MuiTypography: {
      root: {
        scrollMarginTop: '100px',
      },
    },
  },
});
