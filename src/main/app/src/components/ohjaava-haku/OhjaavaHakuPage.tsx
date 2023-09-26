import React, { useState } from 'react';

import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import * as specs from '#/ohjaava-haku.json';
import { ContentWrapper } from '#/src/components/common/ContentWrapper';
import { Murupolku } from '#/src/components/common/Murupolku';
import { useSearch } from '#/src/components/haku/hakutulosHooks';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { Kysymys, Rajain } from '#/src/components/ohjaava-haku/Kysymys';
import { getChangedRajaimet } from '#/src/components/ohjaava-haku/utils';
import { getHakuUrl } from '#/src/store/reducers/hakutulosSliceSelector';
import { toId } from '#/src/tools/utils';

import { ProgressSivupalkki } from './ProgressSivupalkki';
import { classes, StyledRoot } from './StyledRoot';

export const OhjaavaHaku = () => {
  const { t } = useTranslation();
  const hakuUrl = useSelector(getHakuUrl);
  const theme = useTheme();
  const { clearRajainValues } = useSearch();
  const [allSelectedRajainValues, setAllSelectedRajainValues] = useState<Rajain>({});

  const toggleAllRajainValues = (id: string, rajainId: string) => {
    setAllSelectedRajainValues(getChangedRajaimet(allSelectedRajainValues, rajainId, id));
  };

  const ohjaavaHakuTitle = t('ohjaava-haku.otsikko');
  const [isStartOfKysely, setStartOfKysely] = useState(true);
  const [currentKysymysIndex, setCurrentKysymysIndex] = useState(0);
  const lastKysymysIndex = specs.kysymykset.length - 1;
  const kysymykset = specs.kysymykset;
  const currentKysymys = kysymykset[currentKysymysIndex];
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClick = () => {
    setStartOfKysely(false);
    clearRajainValues();
  };

  return (
    <ContentWrapper>
      <StyledRoot>
        <Box>
          <Murupolku
            path={[
              { name: t('haku.otsikko'), link: hakuUrl },
              { name: ohjaavaHakuTitle },
            ]}
          />
        </Box>
        {isStartOfKysely ? (
          <Box>
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
              onClick={handleClick}
              variant="contained"
              color="primary"
              sx={{ marginBottom: '30%' }}>
              {t('ohjaava-haku.aloita-kysely')}
            </Button>
          </Box>
        ) : (
          <Box className={classes.container}>
            <ProgressSivupalkki
              kysymykset={kysymykset}
              currentKysymysIndex={currentKysymysIndex}
              setCurrentKysymysIndex={setCurrentKysymysIndex}
              isMobile={isMobile}
            />
            <Kysymys
              kysymys={currentKysymys}
              kysymykset={kysymykset}
              currentKysymysIndex={currentKysymysIndex}
              setCurrentKysymysIndex={setCurrentKysymysIndex}
              lastKysymysIndex={lastKysymysIndex}
              toggleAllSelectedRajainValues={toggleAllRajainValues}
              allSelectedRajainValues={allSelectedRajainValues}
              setAllSelectedRajainValues={setAllSelectedRajainValues}
              isMobile={isMobile}
            />
          </Box>
        )}
      </StyledRoot>
    </ContentWrapper>
  );
};
