import React from 'react';

import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';
import { formatDateString } from '#/src/tools/utils';

const useStyles = makeStyles({
  card: {
    cursor: 'pointer',
    fontSize: '19px',
    lineHeight: '26px',
    color: colors.brandGreen,
    height: '100%',
  },
  content: {
    marginTop: '20px',
    marginBottom: '5px',
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
  kategoria: {
    textTransform: 'uppercase',
    color: colors.darkGrey,
    fontSize: '14px',
    lineHeight: '19px',
    fontWeight: 'light',
  },
  pvm: {
    color: colors.darkGrey,
    fontSize: '14px',
    lineHeight: '19px',
    textAlign: 'end',
  },
});

export const Uutinen = ({ id }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { data, forwardTo, assetUrl } = useContentful();

  const uutinen = data.uutinen[id];
  const link = (uutinen.sivu || {}).id;

  const { asset } = data;
  const imgUrl = (uutinen) => {
    const assetForEntry = (entry) => {
      const image = entry.image || {};
      return image ? asset[image.id] : null;
    };
    const a = assetForEntry(uutinen);
    return a ? assetUrl(a.url) : null;
  };

  const forwardToPage = (id) => {
    history.push(`/${i18n.language}${forwardTo(id)}`);
  };
  const timestamp = uutinen.updated || uutinen.created;

  return (
    <Grid item xs={12} sm={6} md={4} onClick={() => link && forwardToPage(link)}>
      <Card className={classes.card} elevation={6}>
        <CardMedia
          className={classes.media}
          image={imgUrl(uutinen)}
          role="img"
          title={uutinen.name}
        />
        <CardContent>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={6} className={classes.kategoria}>
              {t('uutinen.kategoria')}
            </Grid>
            <Grid item xs={6} className={classes.pvm}>
              {timestamp && formatDateString(timestamp)}
            </Grid>
          </Grid>
          <div className={classes.content}>
            <Markdown>{uutinen.content}</Markdown>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};
