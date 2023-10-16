import { Box, Button, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useHakukohdeFavourites } from '#/src/hooks/useHakukohdeFavourites';

import { useNotification } from '../../hooks/useNotification';

export const ToggleFavouriteButton = ({
  hakukohdeOid,
  softRemove,
  notifyOnAdd = false,
}: {
  hakukohdeOid?: string;
  softRemove?: boolean;
  notifyOnAdd?: boolean;
}) => {
  const { toggleFavourite, hakukohdeFavourites, softToggleFavourite } =
    useHakukohdeFavourites();

  const showNotification = useNotification((state) => state.showNotification);

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
        if (notifyOnAdd && !isAdded) {
          showNotification({
            content: (
              <>
                <Box>{t('suosikit.suosikki-lisatty')}</Box>
                <Link
                  sx={{ color: 'white', textDecorationColor: 'white' }}
                  href="suosikit">
                  {t('suosikit.katso-suosikkejasi')}
                </Link>
              </>
            ),
            severity: 'success',
          });
        }
      }}
      startIcon={<MaterialIcon icon={isAdded ? 'favorite' : 'favorite_border'} />}>
      {isAdded ? t('suosikit.poista') : addText}
    </Button>
  ) : null;
};
