import React, { useLayoutEffect } from 'react';

import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

import { colors } from '#/src/colors';
import Murupolku from '#/src/components/common/Murupolku';
import { useContentful } from '#/src/hooks/useContentful';

import Sisalto from './Sisalto';
import TableOfContents from './TableOfContents';

const PREFIX = 'Sivu';

const classes = {
  notFound: `${PREFIX}-notFound`,
  header1: `${PREFIX}-header1`,
  icon: `${PREFIX}-icon`,
  component: `${PREFIX}-component`,
};

const Root = styled('div')({
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '32px',
  '&:last-child': {
    paddingBottom: '32px',
  },
  fontSize: '16px',
  lineHeight: '27px',
  color: colors.black,
  [`& .${classes.notFound}`]: {
    textAlign: 'center',
  },
  [`& .${classes.header1}`]: {
    fontSize: '40px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '30px',
    fontWeight: '700',
    color: colors.black,
  },
  [`& .${classes.icon}`]: {
    fontSize: '16px',
  },
});

export const Sivu = ({ id }) => {
  const { data, murupolku } = useContentful();

  const { hash } = useLocation();

  useLayoutEffect(() => {
    const el = hash === '#' ? null : document.getElementById(hash.substring(1));
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  const pageId = id;
  const { sivu } = data;
  const page = sivu[pageId];

  const { content, description, name } = page;
  const tableOfContents = page.tableOfContents === 'true';

  return (
    <Root className={classes.component}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        alignItems="center">
        <Grid item xs={12} sm={12} md={tableOfContents ? 10 : 6}>
          <Murupolku path={murupolku(pageId)} />
          <h1 className={classes.header1}>{name}</h1>
          <p>{description}</p>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} justifyContent="center">
        {tableOfContents ? (
          <Grid item xs={12} sm={12} md={3}>
            <TableOfContents content={content} />
          </Grid>
        ) : null}
        <Grid item xs={12} sm={12} md={tableOfContents ? 7 : 6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Sisalto content={content} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Root>
  );
};
