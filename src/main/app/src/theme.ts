import { createTheme } from '@mui/material';
import { createStyled } from '@mui/system';
import createBreakpoints from '@mui/system/createTheme/createBreakpoints';

import { colors } from './colors';
import { SmartLink } from './components/common/SmartLink';

// Material UI theme customization
// Learn more: https://mui.com/material-ui/customization/theming/

const HEADER_HEIGHT_PX = 72;

const breakpoints = {
  ...createBreakpoints({}),
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1600,
    xxl: 1920,
  },
};

const cssBreakWordRule = {
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
  hyphens: 'auto',
};

export const theme = createTheme({
  headerHeight: HEADER_HEIGHT_PX,
  breakpoints,
  palette: {
    primary: {
      main: colors.brandGreen,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.brandGreen,
    },
    text: {
      primary: colors.grey900,
      secondary: colors.grey900,
    },
    inverted: {
      main: colors.white,
      contrastText: colors.brandGreen,
    },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'Open Sans, Arial, Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      letterSpacing: '-0.09375rem',
      fontWeight: 700,
      color: colors.grey900,
      lineHeight: '3rem',
      marginBottom: '1.5rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.8rem',
        letterSpacing: '-0.075rem',
        lineHeight: '2.375rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: colors.grey900,
      lineHeight: '2.25rem',
      marginBottom: '1rem',
      [breakpoints.down('sm')]: {
        fontSize: '1.75rem',
        lineHeight: '2rem',
        ...cssBreakWordRule,
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: '2rem',
      marginBottom: '0.5rem',
      color: colors.grey900,
      [breakpoints.down('sm')]: {
        fontSize: '1.5rem',
        lineHeight: '1.875rem',
        ...cssBreakWordRule,
      },
    },
    h4: {
      color: colors.grey900,
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
      color: colors.grey900,
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
      color: colors.grey900,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: '1.6875rem',
      color: colors.grey900,
      [breakpoints.down('sm')]: {
        lineHeight: '1.6875rem',
      },
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          height: 70,
          marginBottom: 30,
          justifyContent: 'center',
          boxShadow:
            '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.1), 0px 2px 1px -1px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme: myTheme }) => ({
          ...myTheme.typography.body1,
          color: ownerState.color,
        }),
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: '1px',
          '&.Mui-disabled': {
            borderColor: colors.grey600,
            color: colors.grey600,
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: colors.grey600,
            color: colors.white,
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: SmartLink,
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
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
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: colors.white,
          '&::before': {
            border: `1px solid ${colors.grey500}`,
          },
        },
        tooltip: {
          backgroundColor: colors.white,
          cursor: 'auto',
          userSelect: 'all',
          color: colors.grey900,
          fontSize: 12,
          border: `1px solid ${colors.grey500}`,
        },
      },
    },
    MuiList: {
      styleOverrides: {
        padding: {
          paddingTop: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        dense: {
          paddingTop: 0,
          paddingBottom: 0,
        },
        gutters: {
          paddingRight: '4px',
          paddingLeft: 0,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 32,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          width: '100%',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        component: SmartLink,
      },
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          scrollMarginTop: `${HEADER_HEIGHT_PX}px`,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          boxShadow: 'inset 0 0 0 10px rgba(0, 0, 0, 1);',
          background: 'rgba(0,0,0,0.5)',
          opacity: 1,
          transition: 'all 0.5s',
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        popper: {
          zIndex: 3,
        },
      },
    },
    MuiAccordion: {
      defaultProps: {
        disableGutters: true,
      },
    },
  },
});

export const getHeaderHeight = (themeProp: typeof theme) => themeProp.headerHeight;

export const styled = createStyled({ defaultTheme: theme });
