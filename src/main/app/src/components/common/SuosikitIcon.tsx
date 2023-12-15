import { Badge } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSuosikitCount } from '#/src/hooks/useSuosikitSelection';
import { styled } from '#/src/theme';

export const DarkBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    backgroundColor: colors.green900,
    color: colors.white,
  },
});

export const SuosikitIcon = () => {
  return (
    <DarkBadge badgeContent={useSuosikitCount()} data-testid="suosikit-badge">
      <MaterialIcon icon="favorite_border" />
    </DarkBadge>
  );
};
