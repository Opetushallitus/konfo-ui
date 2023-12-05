import { Button } from '@mui/material';

import { withDefaultProps } from '#/src/tools/withDefaultProps';

export const TextButton = withDefaultProps(Button, {
  variant: 'text',
  color: 'primary',
});
