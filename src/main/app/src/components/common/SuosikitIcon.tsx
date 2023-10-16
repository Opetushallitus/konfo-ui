import { Badge } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useHakukohdeFavourites } from '#/src/hooks/useHakukohdeFavourites';
import { styled } from '#/src/theme';

export const DarkBadge = styled(Badge)({
  '& .MuiBadge-badge': {
    backgroundColor: colors.darkGreen,
    color: colors.white,
  },
});

export const SuosikitIcon = () => {
  const { hakukohdeFavourites } = useHakukohdeFavourites();
  const suosikitCount = Object.values(hakukohdeFavourites).filter(
    (favourite) => !favourite.removed
  ).length;

  return (
    <DarkBadge badgeContent={suosikitCount}>
      <MaterialIcon icon="favorite_border" />
    </DarkBadge>
  );
};
