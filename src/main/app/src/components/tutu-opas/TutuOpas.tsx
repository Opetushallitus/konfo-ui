import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import tutuConfigObjects from '#/tutu-opas.json';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useState } from 'react';
import { StartPage } from './components/StartPage';
import { QuestionPage } from './components/QuestionPage';
import { useTheme } from '@mui/system';

export const TutuOpas = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isStartPage, setIsStartPage] = useState<boolean>(true);

  return (
    <Container maxWidth="md" sx={{ marginBottom: theme.spacing(8) }}>
      <Box marginBottom={theme.spacing(3)}>
        <Murupolku path={[{ name: t('tutu.tutu-opas.tutu-opas'), link: '/' }]} />
      </Box>
      {isStartPage ? (
        <StartPage setIsStartPage={setIsStartPage} />
      ) : (
        <QuestionPage
          setIsStartPage={setIsStartPage}
          tutuConfigObjects={tutuConfigObjects}
        />
      )}
    </Container>
  );
};
