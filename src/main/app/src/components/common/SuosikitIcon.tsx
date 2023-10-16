import { Badge } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useNonRemovedSuosikitCount } from '#/src/hooks/useSuosikitSelection';
import { styled } from '#/src/theme';

export const DarkBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    backgroundColor: colors.darkGreen,
    color: colors.white,
  },
});

export const SuosikitIcon = () => {
  return (
    <DarkBadge badgeContent={useNonRemovedSuosikitCount()}>
      <MaterialIcon icon="favorite_border" />
    </DarkBadge>
  );
};
