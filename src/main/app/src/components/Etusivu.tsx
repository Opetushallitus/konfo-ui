import React, { useEffect, useMemo, useState } from 'react';

import { Box, Button, Grid, Paper } from '@mui/material';
import { isEmpty, size, sortBy, take } from 'lodash';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { YhteishakuKortti } from '#/src/components/kortti/YhteishakuKortti';
import { useContentful } from '#/src/hooks/useContentful';
import { usePageSectionGap } from '#/src/hooks/usePageSectionGap';
import { styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';

import { CondGrid } from './CondGrid';
import { ContentSection } from './ContentSection';
import { useSearch } from './haku/hakutulosHooks';
import { HeadingBoundary } from './Heading';
import { Jumpotron } from './Jumpotron';
import { Kortti } from './kortti/Kortti';
import { Pikalinkit } from './Pikalinkit';
import { Uutiset } from './uutinen/Uutiset';

const StyledInfo = styled(Paper)({
  backgroundColor: colors.grey50,
  borderRadius: 2,
  padding: '25px 20px',
  width: '100%',
});

const ShowMoreButton = styled(Button)({
  marginTop: '55px',
  fontWeight: 600,
  textTransform: 'none',
});

export const Etusivu = () => {
  const { t } = useTranslation();

  const { clearRajainValues, setKeyword } = useSearch();
  const { data, isLoading } = useContentful();
  const { info: infoData, uutiset, kortit, infoYhteishaku, pikalinkit, content } = data;

  const infos = Object.values(infoData || {});

  const yhteishakuInfos = sortBy(Object.values(infoYhteishaku || {}), 'order');

  const uutislinkit = useMemo(
    () => uutiset?.['etusivun-uutiset']?.linkit ?? [],
    [uutiset]
  );
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowMore(size(uutislinkit) > 3);
    }
  }, [isLoading, uutislinkit]);

  useEffectOnce(() => {
    // NOTE: Tyhjätään aina kaikki hakutulosvalinnat kun saavutaan etusivulle
    setKeyword('');
    clearRajainValues();
  });
  const pikalinkitData = getOne(pikalinkit);

  const pageSectionGap = usePageSectionGap();

  return (
    <Box>
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
                          <StyledInfo elevation={0}>
                            <Markdown>{info.content}</Markdown>
                          </StyledInfo>
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
            {!isEmpty(getOne(kortit)?.kortit) && (
              <CondGrid item>
                <ContentSection heading={getOne(kortit)?.name ?? t('oikopolut')}>
                  <CondGrid container spacing={3}>
                    {/* Kortit-sisältötyyppi kuvaa korttilistauksen etusivulla, joten niitä on aina vain yksi */}
                    {getOne(kortit)?.kortit?.map((k) => (
                      <Kortti key={k?.id} id={k?.id} />
                    ))}
                  </CondGrid>
                </ContentSection>
              </CondGrid>
            )}
            {!isEmpty(uutislinkit) && (
              <CondGrid item>
                <ContentSection
                  heading={getOne(uutiset)?.name ?? t('ajankohtaista-ja-uutisia')}>
                  <Grid container spacing={3}>
                    <Uutiset uutiset={showMore ? take(uutislinkit, 3) : uutislinkit} />
                  </Grid>
                  {showMore ? (
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center">
                      <ShowMoreButton
                        variant="contained"
                        onClick={() => setShowMore(false)}
                        color="primary">
                        {t('näytä-kaikki')}
                      </ShowMoreButton>
                    </Grid>
                  ) : null}
                </ContentSection>
              </CondGrid>
            )}
          </CondGrid>
        </HeadingBoundary>
      )}
    </Box>
  );
};
