import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';
import SVG from 'react-inlinesvg';

type InlineSvgIconProps = {
  src: string;
} & SvgIconProps;

export const InlineSvgIcon = ({ src, sx, ...rest }: InlineSvgIconProps) => {
  return (
    <SvgIcon
      sx={[
        {
          fontSize: '1.4em',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}>
      <SVG fontSize="inherit" fill="currentColor" src={src} />
    </SvgIcon>
  );
};
