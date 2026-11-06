import { Box, Container, List, ListItem } from '@mui/material';
import { OphButton, OphTypography } from '@opetushallitus/oph-design-system';
import { useTranslation } from 'react-i18next';

import { Murupolku } from '#/src/components/common/Murupolku';

export const TutuOpas = () => {
  const { t } = useTranslation();

  const translationKeys = ['paatos', 'hakeminen', 'lisatiedot'];

  return (
    <Container maxWidth="md" sx={{ marginBottom: '64px' }}>
      <Box marginBottom="24px">
        <Murupolku path={[{ name: t('tutu.tutu-opas.tutu-opas'), link: '/' }]} />
      </Box>
      <OphTypography variant="h1" sx={{ marginBottom: '24px', alignSelf: 'center' }}>
        {t('tutu.tutu-opas.tutu-opas')}
      </OphTypography>
      <Box marginBottom="24px">
        <OphTypography>{t('tutu.tutu-opas.start-page.intro')}</OphTypography>
      </Box>
      <OphTypography>{t('tutu.tutu-opas.start-page.info-list.heading')}</OphTypography>
      <List sx={{ listStyleType: 'disc', marginLeft: '1.5rem', padding: 0 }}>
        {translationKeys.map((key: string) => (
          <ListItem key={key} sx={{ display: 'list-item', padding: 0 }}>
            {t(`tutu.tutu-opas.start-page.info-list.${key}`)}
          </ListItem>
        ))}
      </List>
      <Box marginBottom="24px" marginTop="24px">
        <OphTypography>{t('tutu.tutu-opas.start-page.ending')}</OphTypography>
      </Box>
      <OphButton variant="contained" sx={{ width: '20%' }}>
        {t('tutu.tutu-opas.start-page.aloita')}
      </OphButton>
    </Container>
  );
};

export const TutuOpasPage = () => {
  return <TutuOpas />;
};
