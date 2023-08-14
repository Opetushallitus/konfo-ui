import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

export const usePageSectionGap = () => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  return isSmall ? 3 : 6;
};
