import React from 'react';

import { Box, OutlinedInput } from '@mui/material';

import { styled } from '#/src/theme';

const StyledBox = styled(Box)`
  display: flex;
  gap: 0.5rem;
`;

export const MaksunMaaraInput = ({
  id,
  value,
  handleInputValueChange,
  unitComponent,
}: {
  id: string;
  value: string;
  handleInputValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  unitComponent: React.ReactNode;
}) => {
  return (
    <StyledBox>
      <OutlinedInput id={id} value={value} onChange={handleInputValueChange} />
      {unitComponent}
    </StyledBox>
  );
};
