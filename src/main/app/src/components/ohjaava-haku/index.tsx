import React from 'react';

import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { Murupolku } from '#/src/components/common/Murupolku';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { toId } from '#/src/tools/utils';

export const OhjaavaHaku = () => {
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);
  const ohjaavaHakuTitle = t('ohjaava-haku.otsikko');

  return (
    <ContentWrapper>
      <Box width="100%" alignItems="start">
        <Box>
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl },
              { name: ohjaavaHakuTitle },
            ]}
          />
        </Box>
        <HeadingBoundary>
          <Heading
            id={toId(t(ohjaavaHakuTitle))}
            variant="h2"
            sx={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            {ohjaavaHakuTitle}
          </Heading>
        </HeadingBoundary>
        <Typography sx={{ marginBottom: '1.5rem' }}>
          {t('ohjaava-haku.info-text')}
        </Typography>
        <Button
          href="/ohjaava-haku/1"
          variant="contained"
          color="primary"
          sx={{ marginBottom: '30%' }}>
          {t('ohjaava-haku.aloita-kysely')}
        </Button>
      </Box>
    </ContentWrapper>
  );
};
