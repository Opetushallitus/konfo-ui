import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const VertailuNotificationContent = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ color: 'white' }}>
      <Box fontWeight="bold">{t('suosikit-vertailu.lisatty-vertailuun')}</Box>
      <Link
        type="button"
        sx={{ color: 'white', textDecorationColor: 'white' }}
        href="suosikit/vertailu">
        {t('suosikit-vertailu.siirry-vertailuun')}
      </Link>{' '}
      <span>{t('suosikit-vertailu.valittu-notification-text-suffix')}</span>
    </Box>
  );
};
