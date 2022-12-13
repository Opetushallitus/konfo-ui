import React from 'react';

import { Grid, Card, CardContent, Paper, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Markdown from 'markdown-to-jsx';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks';

const PREFIX = 'YhteishakuKortti';

const classes = {
  card: `${PREFIX}-card`,
  media: `${PREFIX}-media`,
  link: `${PREFIX}-link`,
  linkElement: `${PREFIX}-linkElement`,
  otsikko: `${PREFIX}-otsikko`,
  haku: `${PREFIX}-haku`,
  verkko: `${PREFIX}-verkko`,
  polku: `${PREFIX}-polku`,
  toinenaste: `${PREFIX}-toinenaste`,
  kk: `${PREFIX}-kk`,
  button: `${PREFIX}-button`,
  hakulomakeButton: `${PREFIX}-hakulomakebutton`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.card}`]: {
    display: 'block',
    height: '100%',
  },
  [`& .${classes.media}`]: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  [`& .${classes.link}`]: {
    color: colors.white,
    display: 'block',
    fontSize: '16px',
    lineHeight: '35px',
  },
  [`& .${classes.linkElement}`]: {
    color: colors.white,
    textDecoration: 'none',
    verticalAlign: 'super',
  },
  [`& .${classes.otsikko}`]: {
    color: colors.white,
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '28px',
    paddingTop: '10px',
    paddingBottom: '15px',
  },
  [`& .${classes.haku}`]: {
    background: colors.blue,
  },
  [`& .${classes.verkko}`]: {
    background: colors.red,
  },
  [`& .${classes.polku}`]: {
    background: colors.brandGreen,
  },
  [`& .${classes.toinenaste}`]: {
    background: colors.brandGreen,
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
    padding: '10px 20px',
    margin: 'auto',
  },
  [`& .${classes.hakulomakeButton}`]: {
    color: colors.black,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: '10px 20px',
    margin: 'auto',
  },
});

const YhteishakuKortti = ({ id }) => {
  const { data } = useContentful();

  console.log('rendering yh-kortti for id ', id);

  const tdata = data?.infoYhteishaku;
  console.log('rendering yh-kortti for id ', tdata);

  const yhInfo = tdata[id];
  console.log('target: ', yhInfo);

  return (
    <StyledGrid item xs={12} sm={12} md={6}>
      <Card className={clsx(classes.card, classes[yhInfo.color])}>
        <CardContent>
          <Paper
            className={clsx(classes[yhInfo.color])}
            elevation={0}
            onClick={() => {
              console.log('hui');
            }}>
            <span className="notification-content">
              <h2>{yhInfo.otsikko}</h2>
              <Markdown>{yhInfo.kuvaus}</Markdown>
            </span>
          </Paper>

          <Box display="flex" justifyContent="space-between">
            <Button
              className={classes.hakulomakeButton}
              variant={'outlined'}
              href={yhInfo.linkkiHakulomakkeelle}>
              {'Täytä hakulomake'}
            </Button>
            <Button
              className={classes.button}
              variant={'outlined'}
              href={yhInfo.linkkiOhjeisiin}>
              {'Ohjeet hakemiseen'}
            </Button>
            <Button
              className={classes.button}
              variant={'outlined'}
              href={yhInfo.linkkiHakutuloksiin}>
              {'Tutustu koulutuksiin'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </StyledGrid>
  );
};

export default YhteishakuKortti;
