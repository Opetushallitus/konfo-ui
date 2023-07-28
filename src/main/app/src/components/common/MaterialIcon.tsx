import { SvgIconProps } from '@mui/material';

import { InlineSvgIcon } from './InlineSvgIcon';

export const MaterialIcon = ({
  name,
  variant = 'filled',
  ...rest
}: {
  name: MaterialIconName;
  variant?: 'filled' | 'outlined';
} & SvgIconProps) => (
  <InlineSvgIcon {...rest} src={`/konfo/icons/material/${variant}/${name}.svg`} />
);
