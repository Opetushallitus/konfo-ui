import { Badge } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialSymbol } from '#/src/components/common/MaterialSymbol';
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
      <MaterialSymbol icon="favorite" />
    </DarkBadge>
  );
};
