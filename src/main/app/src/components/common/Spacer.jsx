import React from 'react';

import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';

const Root = styled('div')({
  height: '4px',
  width: '30px',
  borderRadius: '2px',
  backgroundColor: colors.brandGreen,
  margin: '20px',
});

const Spacer = () => {
  return <Root />;
};

export default Spacer;
