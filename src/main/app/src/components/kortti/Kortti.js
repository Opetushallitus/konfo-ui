import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';

import { colors } from '../../colors';
import { useStores } from '../../hooks';

const useStyles = makeStyles({
  card: {
    height: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  link: {
    color: colors.white,
    display: 'block',
    fontSize: '16px',
    lineHeight: '35px',
  },
  linkElement: {
    color: colors.white,
    textDecoration: 'none',
    verticalAlign: 'super',
  },
  otsikko: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '28px',
    paddingTop: '10px',
    paddingBottom: '15px',
  },
  haku: {
    background: colors.blue,
  },
  verkko: {
    background: colors.red,
  },
  polku: {
    background: colors.brandGreen,
  },
});

const Kortti = ({ id }) => {
  const classes = useStyles();
  const { contentfulStore } = useStores();
  const { asset, sivu } = contentfulStore.data;
  const { forwardTo } = contentfulStore;
  const kortti = contentfulStore.data.kortti[id];

  const linkit = kortti.linkit || [];
  const getImgUrl = (uutinen) => {
    const a = asset[uutinen.image?.id];
    return a ? contentfulStore.assetUrl(a.url) : null;
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={clsx(classes.card, classes[kortti.color])}>
        <CardMedia
          className={classes.media}
          image={getImgUrl(kortti)}
          title={kortti.name}
        />
        <CardContent>
          <h2 className={classes.otsikko}>{kortti.name}</h2>
          {linkit
            .map((l) => sivu[l?.id])
            .filter(Boolean)
            .map((page) => (
              <div className={classes.link} key={page.id}>
                <Icon>chevron_right</Icon>
                <LocalizedLink
                  component={RouterLink}
                  className={classes.linkElement}
                  to={forwardTo(page.id)}>
                  {page.name}
                </LocalizedLink>
              </div>
            ))}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default observer(Kortti);
