import React from 'react';

import { styled } from '#/src/theme';

const StyledInvisibleText = styled('span')(() => ({
  height: '1px',
  width: '1px',
  position: 'absolute',
  overflow: 'hidden',
  top: '-10px',
}));

export const AccessibleInvisibleText = ({ text }: { text: string }) => (
  <StyledInvisibleText>{text}</StyledInvisibleText>
);
