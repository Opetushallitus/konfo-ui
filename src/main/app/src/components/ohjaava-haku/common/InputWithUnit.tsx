import React from 'react';

import { Box, InputLabel, OutlinedInput } from '@mui/material';

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
        sx={{ overflow: 'visible', alignSelf: 'center' }}
        htmlFor={id}
        aria-label={inputLabel}>
        {unitComponent}
      </InputLabel>
    </Box>
  );
};
