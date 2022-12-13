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
  hakulomakeButtonKk: `${PREFIX}-hakulomakebuttonkk`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.card}`]: {
    display: 'block',
    height: '100%',
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
    padding: '5px 10px',
    margin: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  [`& .${classes.hakulomakeButton}`]: {
    color: colors.brandGreen,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: '5px 10px',
    margin: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  [`& .${classes.hakulomakeButtonKk}`]: {
    color: colors.kkMagenta,
    borderColor: colors.white,
    backgroundColor: colors.white,
    borderRadius: 3,
    padding: '5px 10px',
    margin: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
});

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
          <Paper className={clsx(classes[yhInfo.color])} elevation={0}>
            <span className="notification-content">
              <h2>{yhInfo.otsikko}</h2>
              <Markdown>{yhInfo.kuvaus}</Markdown>
            </span>
          </Paper>

          <Box display="flex" justifyContent="space-between">
            <Button
              className={kk ? classes.hakulomakeButtonKk : classes.hakulomakeButton}
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
