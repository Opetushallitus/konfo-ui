import { Box, List, ListItem } from '@mui/material';
import { OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';
import { NavigationButton } from './NavigationButton';

import { Dispatch } from 'react';

export const StartPage = ({ setIsStartPage }: { setIsStartPage: Dispatch<boolean> }) => {
  const { t } = useTranslation();

  const translationKeys = ['paatos', 'hakeminen', 'lisatiedot'];

  return (
    <>
      <OphTypography variant="h1" sx={{ marginBottom: '24px', alignSelf: 'center' }}>
        {t('tutu.tutu-opas.tutu-opas')}
      </OphTypography>
      <OphTypography sx={{ marginBottom: '24px' }}>
        {t('tutu.tutu-opas.start-page.intro')}
      </OphTypography>
      <OphTypography>{t('tutu.tutu-opas.start-page.info-list.heading')}</OphTypography>
      <List sx={{ listStyleType: 'disc', padding: '0 0 0 1.5rem' }}>
        {translationKeys.map((key: string) => (
          <ListItem key={key} sx={{ display: 'list-item', padding: 0 }}>
            {t(`tutu.tutu-opas.start-page.info-list.${key}`)}
          </ListItem>
        ))}
      </List>
      <Box>
        <OphTypography sx={{ margin: '24px 0' }}>
          {t('tutu.tutu-opas.start-page.ending')}
        </OphTypography>
      </Box>
      <NavigationButton variant="contained" onClick={() => setIsStartPage(false)}>
        {t('tutu.tutu-opas.start-page.aloita')}
      </NavigationButton>
    </>
  );
};
