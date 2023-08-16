import React, { useEffect, useState } from 'react';

import { Box, Button, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isEmpty, size, sortBy, take } from 'lodash';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { YhteishakuKortti } from '#/src/components/kortti/YhteishakuKortti';
import { useContentful } from '#/src/hooks/useContentful';
import { usePageSectionGap } from '#/src/hooks/usePageSectionGap';
import { getOne } from '#/src/tools/getOne';

import { CondGrid } from './CondGrid';
import { ContentSection } from './ContentSection';
import { useSearch } from './haku/hakutulosHooks';
import { HeadingBoundary } from './Heading';
import { Jumpotron } from './Jumpotron';
import { Kortti } from './kortti/Kortti';
import { Pikalinkit } from './Pikalinkit';
import { Uutiset } from './uutinen/Uutiset';

const PREFIX = 'Etusivu';

const classes = {
  info: `${PREFIX}-info`,
  infoYhteishaku: `${PREFIX}-infoYhteishaku`,
  header: `${PREFIX}-header`,
  showMore: `${PREFIX}-showMore`,
};

const Root = styled(Box)({
  [`& .${classes.info}`]: {
    backgroundColor: colors.grey,
    borderRadius: 2,
    padding: '25px 20px',
    width: '100%',
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

export const Etusivu = () => {
  const { t } = useTranslation();

  const { clearFilters, setKeyword } = useSearch();
  const { data, isLoading } = useContentful();
  const { info: infoData, uutiset, kortit, infoYhteishaku, pikalinkit, content } = data;

  const infos = Object.values(infoData || {});

  const yhteishakuInfos = sortBy(Object.values(infoYhteishaku || {}), 'order');

  const uutislinkit = uutiset?.['etusivun-uutiset']?.linkit ?? [];
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowMore(size(uutislinkit) > 3);
    }
  }, [isLoading]);

  useEffectOnce(() => {
    // NOTE: Tyhjätään aina kaikki hakutulosvalinnat kun saavutaan etusivulle
    setKeyword('');
    clearFilters();
  });
  const pikalinkitData = getOne(pikalinkit);

  const pageSectionGap = usePageSectionGap();

  return (
    <Root>
      <Jumpotron />
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <HeadingBoundary>
          <CondGrid
            container
            rowSpacing={pageSectionGap}
            direction="column"
            alignItems="stretch">
            <CondGrid item>
              {!isEmpty(yhteishakuInfos) && (
                <ContentSection>
                  <CondGrid container item spacing={3}>
                    {yhteishakuInfos.map(({ id }) => (
                      <YhteishakuKortti id={id} key={id} n={yhteishakuInfos.length} />
                    ))}
                  </CondGrid>
                </ContentSection>
              )}
            </CondGrid>
            {!isEmpty(infos) && (
              <CondGrid item>
                <ContentSection>
                  <CondGrid container direction="column" rowSpacing={3}>
                    {infos.map((info) =>
                      info?.content ? (
                        <CondGrid item xs={12} key={info.id}>
                          <Paper className={classes.info} elevation={0}>
                            <Markdown>{info.content}</Markdown>
                          </Paper>
                        </CondGrid>
                      ) : null
                    )}
                  </CondGrid>
                </ContentSection>
              </CondGrid>
            )}
            <CondGrid item>
              <Pikalinkit pikalinkit={pikalinkitData} content={content} />
            </CondGrid>
            <CondGrid item>
              <ContentSection heading={t('oikopolut')}>
                <CondGrid container spacing={3}>
                  {/* Kortit-sisältötyyppi kuvaa korttilistauksen etusivulla, joten niitä on aina vain yksi */}
                  {getOne(kortit)?.kortit?.map((k) => <Kortti key={k?.id} id={k?.id} />)}
                </CondGrid>
              </ContentSection>
            </CondGrid>
            <CondGrid item>
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
              </ContentSection>
            </CondGrid>
          </CondGrid>
        </HeadingBoundary>
      )}
    </Root>
  );
};
