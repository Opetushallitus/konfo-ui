import { useMemo, useState } from 'react';

import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { ErrorMessage } from '#/src/components/common/ErrorMessage';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useContentful } from '#/src/hooks/useContentful';

import { QuestionPage } from './components/QuestionPage';
import { StartPage } from './components/StartPage';
import { TutuObject } from './types';

const parseOpasJson = (opasJson: unknown): Array<TutuObject> => {
  if (typeof opasJson === 'string') {
    try {
      const parsed = JSON.parse(opasJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Palveluoppaan opasJson-kentän jäsentäminen epäonnistui', e);
      return [];
    }
  }
  return Array.isArray(opasJson) ? opasJson : [];
};

const TutuOpasContent = () => {
  const [isStartPage, setIsStartPage] = useState<boolean>(true);
  // Palveluoppaan JSON sisältää kaikkien kielten käännökset, joten se luetaan aina suomenkielisestä spacesta
  const { data, isLoading, isError } = useContentful({ language: 'fi' });

  const opasJson = Object.values(data.tutkintojenTunnustamisenPalveluopas ?? {})[0]
    ?.opasJson;

  const tutuConfigObjects = useMemo(() => parseOpasJson(opasJson), [opasJson]);
  const hasFrontPage = tutuConfigObjects.some((obj: TutuObject) => obj.is_frontpage);

  switch (true) {
    case isStartPage:
      return <StartPage setIsStartPage={setIsStartPage} />;
    case isError:
      return <ErrorMessage onRetry={() => window.location.reload()} />;
    case isLoading:
      return <LoadingCircle />;
    case !hasFrontPage:
      return <ErrorMessage onRetry={() => setIsStartPage(true)} />;
    default:
      return (
        <QuestionPage
          setIsStartPage={setIsStartPage}
          tutuConfigObjects={tutuConfigObjects}
        />
      );
  }
};

export const TutuOpas = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ marginBottom: theme.spacing(8) }}>
      <Box marginBottom={theme.spacing(3)}>
        <Murupolku path={[{ name: t('tutu.tutu-opas.tutu-opas'), link: '/' }]} />
      </Box>
      <TutuOpasContent />
    </Container>
  );
};
