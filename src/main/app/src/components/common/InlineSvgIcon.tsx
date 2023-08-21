import React from 'react';

import { SvgIcon, SvgIconProps } from '@mui/material';
import SVG from 'react-inlinesvg';

type InlineSvgIconProps = {
  src: string;
} & SvgIconProps;

export const InlineSvgIcon = ({ src, ...rest }: InlineSvgIconProps) => {
  return (
    <SvgIcon {...rest}>
      <SVG fontSize="inherit" fill="currentColor" src={src} />
    </SvgIcon>
  );
};
