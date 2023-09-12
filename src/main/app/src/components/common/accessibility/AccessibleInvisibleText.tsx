import React from 'react';

import { Typography, styled } from '@mui/material';

const StyledInvisibleText = styled(Typography)(() => ({
  height: '1px',
  width: '1px',
  position: 'absolute',
  overflow: 'hidden',
  top: '-10px',
}));

export const AccessibleInvisibleText = ({ text }: { text: string }) => (
  <StyledInvisibleText>{text}</StyledInvisibleText>
);
