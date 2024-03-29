import { Box, Container, ContainerProps, useMediaQuery, useTheme } from '@mui/material';

import { colors } from '#/src/colors';
import { useScrollToHash } from '#/src/hooks/useScrollToHash';
import { styled } from '#/src/theme';

const StyledContainer = styled(Container)({
  backgroundColor: colors.white,
  maxWidth: '1500px',
  '& a[!class]': {
    color: colors.brandGreen,
    textDecoration: 'underline',
  },
});

export const ContentWrapper = ({
  sx,
  children,
}: Omit<ContainerProps, 'disableGutters'>) => {
  const theme = useTheme();
  useScrollToHash();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <StyledContainer sx={sx} disableGutters={isMobile} maxWidth={false}>
      <Box
        margin="auto"
        paddingLeft={1}
        paddingRight={1}
        display="flex"
        flexDirection="column"
        alignItems="center">
        {children}
      </Box>
    </StyledContainer>
  );
};
