import { Grid } from '@mui/material';

import { styled } from '#/src/theme';

export const InputContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  gap: '1.5rem',
  margin: '0.5rem 0',
  [theme.breakpoints.down('md')]: {
    flexBasis: 'content',
    minWidth: '40%',
  },
}));

export const InputFieldContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  gap: '0.5rem',
  margin: '0.5rem',
  [theme.breakpoints.down('md')]: {
    flexBasis: 'content',
    maxWidth: 'none',
  },
}));
