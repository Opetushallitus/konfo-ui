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
import { CfRecord, ContentfulKortit } from '#/src/types/ContentfulTypes';

import { useSearch } from './haku/hakutulosHooks';
import { Jumpotron } from './Jumpotron';
import { Kortti } from './kortti/Kortti';
import { ReactiveBorder } from './ReactiveBorder';
import { Uutiset } from './uutinen/Uutiset';

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
    paddingTop: '60px',
    paddingBottom: '28px',
    fontWeight: 700,
  },
  [`& .${classes.showMore}`]: {
    marginTop: '55px',
    fontWeight: 600,
    textTransform: 'none',
  },
});

const getFirst = (entry: CfRecord<ContentfulKortit>) =>
  Object.values(entry ?? {})[0] || {};

export const Etusivu = () => {
  const { t } = useTranslation();

  const { clearFilters, setKeyword } = useSearch();
  const { data, isLoading } = useContentful();
  const { info: infoData, uutiset, kortit, infoYhteishaku } = data;

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

  return (
    <Root>
      <Jumpotron />
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <ReactiveBorder>
            <Grid container spacing={3}>
              {yhteishakuInfos.map(({ id }) => (
                <YhteishakuKortti id={id} key={id} n={yhteishakuInfos.length} />
              ))}
            </Grid>
          </ReactiveBorder>

          <ReactiveBorder>
            <Grid container>
              {infos.map((info) => {
                return (
                  <Grid item xs={12} key={info.id}>
                    <Paper className={classes.info} elevation={0}>
                      <span className="notification-content">
                        {info?.content && <Markdown>{info.content}</Markdown>}
                      </span>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container>
              <h2 className={classes.header}>{t('oikopolut')}</h2>
              <Grid container spacing={3}>
                {/* TODO: Miksi tässä halutaan kaivaa vain ensimmäinen korttisetti? Vai tuleeko niitä koskaan enempää */}
                {getFirst(kortit).kortit?.map((k) => <Kortti id={k?.id} key={k?.id} />)}
              </Grid>
            </Grid>
          </ReactiveBorder>
          <ReactiveBorder>
            <Grid container>
              <Grid item xs={12}>
                <h2 className={classes.header}>{t('ajankohtaista-ja-uutisia')}</h2>
              </Grid>
              <Grid container spacing={3}>
                <Uutiset uutiset={showMore ? take(uutislinkit, 3) : uutislinkit} />
              </Grid>

              <Grid container direction="row" justifyContent="center" alignItems="center">
                {showMore && (
                  <Button
                    className={classes.showMore}
                    variant="contained"
                    onClick={() => setShowMore(false)}
                    color="primary">
                    {t('näytä-kaikki')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </ReactiveBorder>
        </>
      )}
    </Root>
  );
};
