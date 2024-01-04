import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useDialogState } from './SiirryHakulomakkeelleDialog';

export const VieHakulomakkeelleNotificationContent = () => {
  const { t } = useTranslation();

  const { setIsOpen } = useDialogState();

  return (
    <Box sx={{ color: 'white' }}>
      <Box fontWeight="bold">{t('suosikit-vertailu.hakukohde-valittu')}</Box>
      <Link
        component="button"
        type="button"
        sx={{ color: 'white', textDecorationColor: 'white' }}
        onClick={() => {
          setIsOpen(true);
        }}>
        {t('suosikit-vertailu.siirry-hakulomakkeelle')}
      </Link>{' '}
      <span>{t('suosikit-vertailu.valittu-notification-text-suffix')}</span>
    </Box>
  );
};
