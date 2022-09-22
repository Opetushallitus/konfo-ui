import React from 'react';

import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';

const PREFIX = 'IconBackground';

const classes = {
  iconBackground: `${PREFIX}-iconBackground`,
};

const Root = styled('span')<Props>(({ color }) => ({
  borderRadius: '50%',
  backgroundColor: color ?? colors.brandGreen,
  padding: '12.5px 15px', // TODO: forced square ratio would be nice but prolly very hard to implement
}));

type Props = {
  children: React.ReactNode;
  color?: string;
};

export const IconBackground = ({ children, color }: Props) => {
  return (
    <Root className={classes.iconBackground} color={color}>
      {children}
    </Root>
  );
};
