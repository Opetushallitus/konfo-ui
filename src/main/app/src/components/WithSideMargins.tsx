import { styled } from '@mui/material/styles';

export const WithSideMargins = styled('div')(({ theme }) => ({
  paddingLeft: 10,
  paddingRight: 10,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: 60,
    paddingRight: 60,
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 90,
    paddingRight: 90,
  },
}));
