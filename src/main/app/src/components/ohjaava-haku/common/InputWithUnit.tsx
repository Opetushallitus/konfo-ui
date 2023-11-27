import React from 'react';

import { Box, InputLabel, OutlinedInput } from '@mui/material';

export const InputWithUnit = ({
  id,
  value,
  handleInputValueChange,
  unitComponent,
  ariaLabel,
  ariaDescribedby,
  type,
}: {
  id: string;
  value: string;
  handleInputValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  unitComponent: React.ReactNode;
  ariaLabel: string;
  ariaDescribedby?: string;
  type?: string;
}) => {
  return (
    <Box display="flex" gap="0.5rem">
      <OutlinedInput
        id={id}
        value={value}
        onChange={handleInputValueChange}
        {...(ariaDescribedby && { 'aria-describedby': ariaDescribedby })}
        type={type}
      />
      <InputLabel
        sx={{ overflow: 'visible', alignSelf: 'center' }}
        htmlFor={id}
        aria-label={ariaLabel}>
        {unitComponent}
      </InputLabel>
    </Box>
  );
};
