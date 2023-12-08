import Box from '@mui/material/Box';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledTextContent = styled('span')({
  textAlign: 'center',
  verticalAlign: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: colors.grey900,
  margin: '0 10px',
  lineHeight: '24px',
  whiteSpace: 'nowrap',
});

export const TextWithBackground = ({ children }: { children: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      justifyItems="center"
      component="span"
      sx={{ backgroundColor: colors.green100, height: 'fit-content' }}>
      <StyledTextContent>{children}</StyledTextContent>
    </Box>
  );
};
