import { Box, Paper } from '@mui/material';

import { educationTypeColorCode } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'backgroundColor',
})<{ backgroundColor: string }>(({ theme, backgroundColor }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '80%',
  backgroundColor,
  [theme.breakpoints.down('sm')]: {
    width: '95%',
  },
}));

// Taustavärillinen "laatikko" koulutus, toteutus jne. sivuilla
export const ColoredPaperContent = ({
  children,
  backgroundColor = educationTypeColorCode.ammatillinenGreenBg,
}: React.PropsWithChildren<{ backgroundColor?: string }>) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      <StyledPaper backgroundColor={backgroundColor}>{children}</StyledPaper>
    </Box>
  );
};
