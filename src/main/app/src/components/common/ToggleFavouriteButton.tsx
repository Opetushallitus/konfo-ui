import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useHakukohdeFavourites } from '#/src/hooks/useHakukohdeFavourites';

export const ToggleFavouriteButton = ({
  hakukohdeOid,
  softRemove,
}: {
  hakukohdeOid?: string;
  softRemove?: boolean;
}) => {
  const { toggleFavourite, hakukohdeFavourites, softToggleFavourite } =
    useHakukohdeFavourites();

  const isAdded = softRemove
    ? !hakukohdeFavourites[hakukohdeOid ?? '']?.removed
    : Boolean(hakukohdeFavourites[hakukohdeOid ?? '']);

  const { t } = useTranslation();

  const addText = softRemove ? t('suosikit.kumoa-poisto') : t('suosikit.lisaa');

  return hakukohdeOid ? (
    <Button
      sx={{
        float: 'right',
        marginLeft: 1,
      }}
      variant="contained"
      onClick={() => {
        if (softRemove) {
          softToggleFavourite(hakukohdeOid);
        } else {
          toggleFavourite(hakukohdeOid);
        }
      }}
      startIcon={<MaterialIcon icon={isAdded ? 'favorite' : 'favorite_border'} />}>
      {isAdded ? t('suosikit.poista') : addText}
    </Button>
  ) : null;
};
