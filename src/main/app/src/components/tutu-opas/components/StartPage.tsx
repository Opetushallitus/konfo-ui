import { Box, List, ListItem } from '@mui/material';
import { OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';
import { NavigationButton } from './NavigationButton';

import { Dispatch } from 'react';
import { useTheme } from '@mui/system';

export const StartPage = ({ setIsStartPage }: { setIsStartPage: Dispatch<boolean> }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const translationKeys = ['paatos', 'hakeminen', 'lisatiedot'];

  return (
    <>
      <OphTypography
        variant="h1"
        sx={{ marginBottom: theme.spacing(3), alignSelf: 'center' }}>
        {t('tutu.tutu-opas.tutu-opas')}
      </OphTypography>
      <OphTypography sx={{ marginBottom: theme.spacing(3) }}>
        {t('tutu.tutu-opas.start-page.intro')}
      </OphTypography>
      <OphTypography>{t('tutu.tutu-opas.start-page.info-list.heading')}</OphTypography>
      <List sx={{ listStyleType: 'disc', padding: `0 0 0 ${theme.spacing(3)}` }}>
        {translationKeys.map((key: string) => (
          <ListItem key={key} sx={{ display: 'list-item', padding: 0 }}>
            {t(`tutu.tutu-opas.start-page.info-list.${key}`)}
          </ListItem>
        ))}
      </List>
      <Box>
        <OphTypography sx={{ margin: `${theme.spacing(3)} 0` }}>
          {t('tutu.tutu-opas.start-page.ending')}
        </OphTypography>
      </Box>
      <NavigationButton variant="contained" onClick={() => setIsStartPage(false)}>
        {t('tutu.tutu-opas.start-page.aloita')}
      </NavigationButton>
    </>
  );
};
