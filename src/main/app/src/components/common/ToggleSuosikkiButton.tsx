import { Box, Button, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';

import { useNotification } from '../../hooks/useNotification';

export const ToggleSuosikkiButton = ({
  hakukohdeOid,
  softRemove,
  notifyOnAdd = false,
}: {
  hakukohdeOid?: string;
  softRemove?: boolean;
  notifyOnAdd?: boolean;
}) => {
  const { toggleSuosikki, suosikitSelection, softToggleSuosikki } =
    useSuosikitSelection();

  const showNotification = useNotification((state) => state.showNotification);

  const isAdded = softRemove
    ? !suosikitSelection[hakukohdeOid ?? '']?.removed
    : Boolean(suosikitSelection[hakukohdeOid ?? '']);

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
          softToggleSuosikki(hakukohdeOid);
        } else {
          toggleSuosikki(hakukohdeOid);
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
