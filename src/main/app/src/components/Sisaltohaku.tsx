import React, { useState, useCallback } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  CardMedia,
  InputBase,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import koulutusPlaceholderImg from '#/src/assets/images/Opolkuhts.png';
import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Murupolku from '#/src/components/common/Murupolku';
import MuiFlatPagination from '#/src/components/pagination';
import { useContentful } from '#/src/hooks';
import { useUrlParams } from '#/src/tools/useUrlParams';

import { Preview } from './Preview';
import { ReactiveBorder } from './ReactiveBorder';

const PREFIX = 'Sisaltohaku';

const classes = {
  root: `${PREFIX}-root`,
  root2: `${PREFIX}-root2`,
  image: `${PREFIX}-image`,
  content: `${PREFIX}-content`,
  sisaltohaku: `${PREFIX}-sisaltohaku`,
  paper: `${PREFIX}-paper`,
  input: `${PREFIX}-input`,
  iconButton: `${PREFIX}-iconButton`,
};

const StyledGrid = styled(Grid)({
  marginTop: '40px',
  [`& .${classes.paper}`]: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
    paddingLeft: '20px',
    backgroundColor: colors.white,
  },
  [`& .${classes.input}`]: {
    borderRadius: 0,
    flex: 1,
  },
  [`& .${classes.iconButton}`]: {
    minHeight: '60px',
    minWidth: '60px',
    borderRadius: 0,
  },
});

type ResultProps = {
  id: string;
  url: string;
  image: { name: string; description: string };
  sivu: { name: string; description: string; content: string; sideContent: string };
  assetUrl: string;
  classes: Record<string, string>;
};

const Result = ({ id, url, image, sivu, assetUrl }: ResultProps) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12} key={id}>
      <LocalizedLink underline="none" component={RouterLink} to={url}>
        <Card
          classes={{
            root: classes.root,
          }}>
          <CardContent className={classes.content}>
            <Typography component="h4" variant="h4">
              {sivu.name}
            </Typography>
            <br />
            <Typography variant="subtitle1" color="textSecondary">
              {sivu.description || <Preview markdown={sivu.content} />}
            </Typography>
          </CardContent>
          <CardMedia
            className={classes.image}
            image={assetUrl || koulutusPlaceholderImg}
            title={image.description || image.name || t('sisaltohaku.paikanpitäjä')}
            aria-label={image.description || image.name || t('sisaltohaku.paikanpitäjä')}
            role="img"
          />
        </Card>
      </LocalizedLink>
    </Grid>
  );
};

const PAGESIZE = 10;
const asKeywords = (s: string) => s.toLowerCase().split(/[ ,]+/);

export const Sisaltohaku = () => {
  const { data, forwardTo, assetUrl } = useContentful();
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { sivu, uutinen } = data;
  const index = Object.entries(sivu)
    .filter(([key, { id }]: any) => key === id)
    .map(([_key, { id, sideContent, content }]: any) => {
      return {
        id: id,
        content: (content + (sideContent || '')).toLowerCase(),
      };
    });
  const fetchResults = useCallback(
    (input) => {
      const keywords = asKeywords(input);
      if (_.isEmpty(keywords)) {
        return [];
      } else {
        return index.filter(({ content }) => keywords.find((kw) => content.includes(kw)));
      }
    },
    [index]
  );
  const { search: urlSearch } = useUrlParams();
  const hakusana = _.trim(urlSearch.hakusana as string);

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(hakusana);
  const [results, setResults] = useState(fetchResults(hakusana));

  const doSearch = useCallback(
    (event) => {
      event?.preventDefault();
      navigate(`/${i18n.language}/sisaltohaku/?hakusana=${search}`);
      setOffset(0);
      setResults(fetchResults(search));
    },
    [fetchResults, i18n, navigate, search]
  );

  const activeSearch = hakusana !== '';
  const pagination = (results || []).length > PAGESIZE;
  const paginate = () =>
    pagination ? results.slice(offset, PAGESIZE + offset) : results;

  return (
    <ReactiveBorder>
      <StyledGrid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        className={classes.sisaltohaku}
        alignItems="center">
        <Grid item xs={12}>
          <Murupolku path={[{ name: t('sisaltohaku.otsikko') }]} />
        </Grid>
        <Grid item xs={12}>
          <Paper
            component="form"
            onSubmit={doSearch}
            elevation={0}
            className={classes.paper}>
            <InputBase
              className={classes.input}
              defaultValue={search}
              onKeyPress={(event) => event.key === 'Enter' && doSearch(event)}
              onChange={({ target }) => setSearch(_.trim(target.value))}
              placeholder={t('sidebar.etsi-tietoa-opintopolusta')}
              inputProps={{
                'aria-label': t('sidebar.etsi-tietoa-opintopolusta'),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.iconButton}
              aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
              <SearchIcon />
            </Button>
          </Paper>
        </Grid>
        {activeSearch && _.isEmpty(results) ? (
          data.loading ? null : (
            <React.Fragment>
              <Grid item xs={12}>
                <h1>{t('sisaltohaku.eituloksia')}</h1>
              </Grid>
              <Grid item xs={12}>
                <span>{t('sisaltohaku.summary', { hakusana: hakusana || '' })}</span>
              </Grid>
              <Grid item xs={12}>
                <LocalizedLink underline="always" component={RouterLink} to="/">
                  {t('sisaltohaku.takaisin')}
                </LocalizedLink>
              </Grid>
            </React.Fragment>
          )
        ) : (
          <>
            {paginate().map(({ id }) => {
              const s = sivu[id];
              const u = uutinen[id];
              const image = u?.image || {};
              return (
                <Result
                  id={id}
                  key={id}
                  url={forwardTo(s.id)!}
                  sivu={s}
                  assetUrl={assetUrl(image.url)}
                  image={image}
                  classes={{
                    root: classes.root2,
                    image: classes.image,
                    content: classes.content,
                  }}
                />
              );
            })}
            {pagination && (
              <MuiFlatPagination
                limit={PAGESIZE}
                offset={offset}
                total={results.length}
                onClick={(e, newOffset) => setOffset(newOffset)}
              />
            )}
          </>
        )}
      </StyledGrid>
    </ReactiveBorder>
  );
};
