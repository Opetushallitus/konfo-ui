import { Avatar, Box } from '@mui/material';

import { colors, educationTypeColorCode } from '#/src/colors';
import { styled } from '#/src/theme';

const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
  },
  display: 'flex',
  justifyContent: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  position: 'absolute',
  width: theme.spacing(8),
  height: theme.spacing(8),
  marginTop: `calc(-${theme.spacing(8)} / 2)`,
  backgroundColor: colors.brandGreen,
  [theme.breakpoints.down('sm')]: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginTop: `calc(-${theme.spacing(6)} / 2)`,
  },
}));

const StyledContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 12, 6, 12),
  backgroundColor: educationTypeColorCode.ammatillinenGreenBg,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 3, 3, 3),
  },
}));

type Props = React.PropsWithChildren<{
  icon: React.ReactNode;
}>;

export const ContentWithTopIcon = ({ children, icon }: Props) => {
  return (
    <StyledBox>
      <StyledAvatar>{icon}</StyledAvatar>
      <StyledContent>{children}</StyledContent>
    </StyledBox>
  );
};
