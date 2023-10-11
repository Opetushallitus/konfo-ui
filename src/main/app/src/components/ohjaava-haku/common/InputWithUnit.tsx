import React from 'react';

import { Box, InputLabel, OutlinedInput } from '@mui/material';

import { classes } from '../StyledRoot';

export const InputWithUnit = ({
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
    <Box display="flex" gap="0.5rem">
      <OutlinedInput id={id} value={value} onChange={handleInputValueChange} />
      <InputLabel
        htmlFor={id}
        className={classes.question__lyhenne}
        aria-label={inputLabel}>
        {unitComponent}
      </InputLabel>
    </Box>
  );
};
