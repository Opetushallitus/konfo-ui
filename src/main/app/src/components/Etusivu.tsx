import React, { useState } from 'react';

import { Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { size, take } from 'lodash';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { YhteishakuKortti } from '#/src/components/kortti/YhteishakuKortti';
import { useContentful } from '#/src/hooks/useContentful';
import { getOne } from '#/src/tools/getOne';

import { ContentSection } from './ContentSection';
import { Gap } from './Gap';
import { useSearch } from './haku/hakutulosHooks';
import { HeadingBoundary } from './Heading';
import { Jumpotron } from './Jumpotron';
import { Kortti } from './kortti/Kortti';
import { Pikalinkit } from './Pikalinkit';
import { Uutiset } from './uutinen/Uutiset';
import { WithSideMargins } from './WithSideMargins';

const PREFIX = 'Etusivu';

const classes = {
  info: `${PREFIX}-info`,
  infoYhteishaku: `${PREFIX}-infoYhteishaku`,
  header: `${PREFIX}-header`,
  showMore: `${PREFIX}-showMore`,
};

const Root = styled('div')({
  [`& .${classes.info}`]: {
    backgroundColor: colors.grey,
    borderRadius: 2,
    padding: '25px 20px',
  },
  [`& .${classes.header}`]: {
    fontSize: '28px',
    paddingBottom: '28px',
    fontWeight: 700,
  },
  [`& .${classes.showMore}`]: {
    marginTop: '55px',
    fontWeight: 600,
    textTransform: 'none',
  },
});

const SectionGap = () => <Gap y={6} />;

export const Etusivu = () => {
  const { t } = useTranslation();

  const { clearFilters, setKeyword } = useSearch();
  const { data, isLoading } = useContentful();
  const { info: infoData, uutiset, kortit, infoYhteishaku, pikalinkit, content } = data;

  const infos = Object.values(infoData || {});

  const yhteishakuInfos = Object.values(infoYhteishaku || {});

  yhteishakuInfos.sort((a, b) => {
    return (a?.order || 99) - (b?.order || 99);
  });

  const uutislinkit = uutiset?.['etusivun-uutiset']?.linkit ?? [];

  const [showMore, setShowMore] = useState(size(uutislinkit) <= 3);

  useEffectOnce(() => {
    // NOTE: Tyhjätään aina kaikki hakutulosvalinnat kun saavutaan etusivulle
    setKeyword('');
    clearFilters();
  });
  const pikalinkitData = getOne(pikalinkit);

  return (
    <Root>
      <Jumpotron />
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <HeadingBoundary>
          <WithSideMargins>
            <SectionGap />
            <Grid container spacing={3}>
              {yhteishakuInfos.map(({ id }) => (
                <YhteishakuKortti id={id} key={id} n={yhteishakuInfos.length} />
              ))}
            </Grid>
            <Gap y={3} />
            <Grid container>
              {infos.map((info) => (
                <Grid item xs={12} key={info.id}>
                  <Paper className={classes.info} elevation={0}>
                    <span className="notification-content">
                      {info?.content && <Markdown>{info.content}</Markdown>}
                    </span>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </WithSideMargins>
          <SectionGap />
          <Pikalinkit pikalinkit={pikalinkitData} content={content} />
          <SectionGap />
          <WithSideMargins>
            <ContentSection heading={t('oikopolut')}>
              <Grid container spacing={3}>
                {/* Kortit-sisältötyyppi kuvaa korttilistauksen etusivulla, joten niitä on aina vain yksi */}
                {getOne(kortit)?.kortit?.map((k) => <Kortti id={k?.id} key={k?.id} />)}
              </Grid>
            </ContentSection>
            <SectionGap />
            <ContentSection heading={t('ajankohtaista-ja-uutisia')}>
              <Grid container spacing={3}>
                <Uutiset uutiset={showMore ? take(uutislinkit, 3) : uutislinkit} />
              </Grid>
              {showMore ? (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center">
                  <Button
                    className={classes.showMore}
                    variant="contained"
                    onClick={() => setShowMore(false)}
                    color="primary">
                    {t('näytä-kaikki')}
                  </Button>
                </Grid>
              ) : null}
              <SectionGap />
            </ContentSection>
          </WithSideMargins>
        </HeadingBoundary>
      )}
    </Root>
  );
};
