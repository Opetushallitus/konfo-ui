import React from 'react';

import { Box, InputLabel, OutlinedInput } from '@mui/material';

import { styled } from '#/src/theme';

import { classes } from '../StyledRoot';

const StyledBox = styled(Box)`
  display: flex;
  gap: 0.5rem;
`;

const UnitComponent = ({
  id,
  unitComponent,
  label,
}: {
  id: string;
  unitComponent: React.ReactNode;
  label: string;
}) => (
  <InputLabel htmlFor={id} className={classes.question__lyhenne} aria-label={label}>
    {unitComponent}
  </InputLabel>
);

export const MaksunMaaraInput = ({
  id,
  value,
  handleInputValueChange,
  unitComponent,
  inputLabel,
}: {
  id: string;
  value: string;
  handleInputValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  unitComponent: React.ReactNode;
  inputLabel: string;
}) => {
  return (
    <StyledBox>
      <OutlinedInput id={id} value={value} onChange={handleInputValueChange} />
      <UnitComponent id={id} unitComponent={unitComponent} label={inputLabel} />
    </StyledBox>
  );
};
