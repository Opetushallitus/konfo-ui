import React, { useEffect, useState } from 'react';

import { Button, Grid, makeStyles, Paper } from '@material-ui/core';
import _ from 'lodash';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { useContentful } from '#/src/hooks';
import { clearSelectedFilters } from '#/src/store/reducers/hakutulosSlice';
import { Info, Uutiset as UutisetType, Kortit } from '#/src/types/ContentfulTypes';

import { Jumpotron } from './Jumpotron';
import Kortti from './kortti/Kortti';
import { ReactiveBorder } from './ReactiveBorder';
import { Uutiset } from './uutinen/Uutiset';

const useStyles = makeStyles({
  info: {
    backgroundColor: colors.grey,
    borderRadius: 2,
    padding: '25px 20px',
    cursor: 'pointer',
  },
  header: {
    fontSize: '28px',
    paddingTop: '60px',
    paddingBottom: '28px',
    fontWeight: 700,
  },
  showMore: {
    marginTop: '55px',
    fontWeight: 600,
    textTransform: 'none',
  },
});

const getFirst = (entry: Kortit) => Object.values(entry || {})[0] || {};

export const Etusivu = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { i18n } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { data, isLoading, forwardTo } = useContentful();
  const {
    info,
    uutiset,
    kortit,
  }: { info: Info; uutiset: UutisetType; kortit: Kortit } = data;

  const forwardToPage = (id: string) => {
    history.push(`/${i18n.language}${forwardTo(id)}`);
  };
  const infos = Object.values(info || {});

  const uutislinkit = uutiset?.['etusivun-uutiset']?.linkit ?? [];

  const [showMore, setShowMore] = useState(!(uutislinkit.length > 3));

  useEffect(() => {
    // NOTE: Tyhjätään aina kaikki hakutulosvalinnat kun saavutaan etusivulle
    dispatch(clearSelectedFilters());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Jumpotron />
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <ReactiveBorder>
            <Grid container>
              {infos.map((info) => (
                <Grid item xs={12} key={info.id}>
                  <Paper
                    className={classes.info}
                    elevation={0}
                    onClick={() => forwardToPage(info.linkki.id)}>
                    <span className="notification-content">
                      <Markdown>{info.content}</Markdown>
                    </span>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Grid container>
              <h1 className={classes.header}>{t('oikopolut')}</h1>
              <Grid container spacing={3}>
                {/* TODO: Miksi tässä halutaan kaivaa vain ensimmäinen korttisetti? Vai tuleeko niitä koskaan enempää */}
                {getFirst(kortit).kortit?.map(({ id }) => (
                  <Kortti id={id} key={id} />
                ))}
              </Grid>
            </Grid>
          </ReactiveBorder>
          <ReactiveBorder>
            <Grid container>
              <Grid item xs={12}>
                <h1 className={classes.header}>{t('ajankohtaista-ja-uutisia')}</h1>
              </Grid>
              <Grid container spacing={3}>
                <Uutiset uutiset={showMore ? _.take(uutislinkit, 3) : uutislinkit} />
              </Grid>

              <Grid container direction="row" justify="center" alignItems="center">
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
    </React.Fragment>
  );
};
