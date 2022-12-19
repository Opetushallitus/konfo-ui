import React from 'react';

import { Grid, Card, CardContent, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Markdown from 'markdown-to-jsx';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

const PREFIX = 'YhteishakuKortti';

const classes = {
  card: `${PREFIX}-card`,
  otsikko: `${PREFIX}-otsikko`,
  kuvaus: `${PREFIX}-kuvaus`,
  toinenaste: `${PREFIX}-toinenaste`,
  kk: `${PREFIX}-kk`,
  button: `${PREFIX}-button`,
  buttons: `${PREFIX}-buttons`,
  hakulomakeButton: `${PREFIX}-hakulomakebutton`,
  hakulomakeButtonKk: `${PREFIX}-hakulomakebuttonkk`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.card}`]: {
    display: 'block',
    height: '100%',
    textAlign: 'center',
  },
  [`& .${classes.otsikko}`]: {
    width: '80%',
    marginLeft: '10%',
    display: 'block',
    textAlign: 'center',
  },
  [`& .${classes.kuvaus}`]: {
    marginLeft: '5%',
    [theme.breakpoints.up('xl')]: {
      marginLeft: '10%',
      marginRight: '10%',
    },
    display: 'block',
  },
  [`& .${classes.toinenaste}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    borderRadius: 2,
    padding: '25px 20px',
  },
  [`& .${classes.kk}`]: {
    backgroundColor: colors.kkMagenta,
    color: colors.white,
    borderRadius: 2,
    padding: '25px 20px',
  },
  [`& .${classes.button}`]: {
    color: colors.white,
    borderColor: colors.white,
    borderRadius: 3,
    padding: '5px 5%',
    margin: '5px 5px',
    fontSize: '14px',
    fontWeight: 'bold',
    [`&:hover`]: {
      backgroundColor: 'transparent',
      borderColor: colors.white,
    },
  },
  [`& .${classes.buttons}`]: {
    display: 'block',
    width: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  [`& .${classes.hakulomakeButton}`]: {
    color: colors.brandGreen,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: '5px 5%',
    margin: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    [`&:hover`]: {
      backgroundColor: colors.white,
      borderColor: colors.white,
    },
  },
  [`& .${classes.hakulomakeButtonKk}`]: {
    color: colors.kkMagenta,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: '5px 5%',
    margin: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    [`&:hover`]: {
      backgroundColor: colors.white,
      borderColor: colors.white,
    },
  },
}));

const YhteishakuKortti = ({ id, n }) => {
  const { data } = useContentful();
  const tdata = data?.infoYhteishaku;
  const yhInfo = tdata[id];

  const kk = yhInfo?.color === 'kk';

  const width = Math.max(12 / n, 6);

  return (
    <StyledGrid item xs={12} sm={12} md={12} lg={12} xl={width}>
      <Card className={clsx(classes.card, classes[yhInfo.color])}>
        <CardContent>
          <h2 className={classes.otsikko}>{yhInfo.otsikko}</h2>
          <Paper className={clsx(classes[yhInfo.color])} elevation={0}>
            <span className="notification-content">
              <Markdown className={classes.kuvaus}>{yhInfo.kuvaus}</Markdown>
            </span>
          </Paper>

          <Grid item className={classes.buttons}>
            {yhInfo.linkkiHakulomakkeelle && yhInfo.tekstiHakulomakkeelle ? (
              <Button
                item
                xs={4}
                className={kk ? classes.hakulomakeButtonKk : classes.hakulomakeButton}
                variant={'outlined'}
                href={yhInfo.linkkiHakulomakkeelle}>
                {yhInfo.tekstiHakulomakkeelle}
              </Button>
            ) : null}
            {yhInfo.linkkiOhjeisiin && yhInfo.tekstiOhjeisiin ? (
              <Button
                item
                xs={4}
                className={classes.button}
                variant={'outlined'}
                href={yhInfo.linkkiOhjeisiin}>
                {yhInfo.tekstiOhjeisiin}
              </Button>
            ) : null}
            {yhInfo.linkkiHakutuloksiin && yhInfo.tekstiHakutuloksiin ? (
              <Button
                item
                xs={4}
                className={classes.button}
                variant={'outlined'}
                href={yhInfo.linkkiHakutuloksiin}>
                {yhInfo.tekstiHakutuloksiin}
              </Button>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </StyledGrid>
  );
};

export default YhteishakuKortti;
