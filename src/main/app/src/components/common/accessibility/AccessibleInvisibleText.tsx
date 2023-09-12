import React from 'react';

import { Typography } from '@mui/material';

import { styled } from '#/src/theme';

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
