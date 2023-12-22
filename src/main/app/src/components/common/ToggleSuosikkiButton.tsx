import { useState } from 'react';

import { Box, Button, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useNotifications } from '#/src/hooks/useNotifications';
import { useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';

import { ConfirmSuosikkiRemoveDialog } from '../ConfirmSuosikkiRemoveDialog';

const ToggleIcon = ({
  isAdded,
  confirmRemove,
}: {
  isAdded: boolean;
  confirmRemove: boolean;
}) => {
  const toggleIcon = isAdded
    ? confirmRemove
      ? 'delete'
      : 'favorite'
    : 'favorite_border';

  return <MaterialIcon icon={toggleIcon} />;
};

export const ToggleSuosikkiButton = ({
  hakukohdeOid,
  notifyOnAdd = false,
  confirmRemove = false,
}: {
  hakukohdeOid?: string;
  notifyOnAdd?: boolean;
  confirmRemove?: boolean;
}) => {
  const { toggleSuosikki, suosikitSelection } = useSuosikitSelection();

  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const showNotification = useNotifications((state) => state.showNotification);

  const isAdded = Boolean(suosikitSelection[hakukohdeOid ?? '']);
  const { t } = useTranslation();

  return hakukohdeOid ? (
    <>
      {confirmRemove && (
        <ConfirmSuosikkiRemoveDialog
          open={isConfirmationOpen}
          hakukohdeOid={hakukohdeOid}
          onClose={() => setConfirmationOpen(false)}
        />
      )}
      <Button
        variant="outlined"
        color="primary"
        //variant="contained"
        onClick={() => {
          if (confirmRemove && isAdded) {
            setConfirmationOpen(true);
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
        startIcon={<ToggleIcon isAdded={isAdded} confirmRemove={confirmRemove} />}>
        {isAdded ? t('suosikit.poista') : t('suosikit.lisaa')}
      </Button>
    </>
  ) : null;
};
