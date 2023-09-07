import React from 'react';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSearch } from '#/src/components/haku/hakutulosHooks';

import { HAKU_RAJAIMET_ORDER } from './HAKU_RAJAIMET_ORDER';

const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: 300,
  },
}));

export const Suodatinpalkki = () => {
  const { setRajainValues, rajainValues, rajainOptions } = useSearch();

  return (
    <StyledGrid item lg={3} md={4}>
      {HAKU_RAJAIMET_ORDER.map(({ id, Component }, index) => (
        <Component
          key={id}
          expanded={index < 2}
          elevation={2}
          rajainOptions={rajainOptions}
          rajainValues={rajainValues}
          setRajainValues={setRajainValues}
        />
      ))}
    </StyledGrid>
  );
};
