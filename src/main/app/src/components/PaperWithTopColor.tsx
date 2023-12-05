import { Paper } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

export const PaperWithTopColor = styled(Paper)<{ topColor?: string }>(
  ({ theme, topColor }) => ({
    borderTop: `5px solid ${topColor ?? colors.brandGreen}`,
    width: '100%',
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1),
    },
  })
);
