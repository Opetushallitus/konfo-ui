import React from 'react';

import { Box, Grid, Icon, makeStyles, Paper, Typography } from '@material-ui/core';
import clsx from 'clsx';
import _ from 'lodash';

import ApurahaIcon from '#/src/assets/images/Apuraha.svg';
import KoulutuksenLaajuusIcon from '#/src/assets/images/koulutuksen_laajuus.svg';
import KoulutusAsteIcon from '#/src/assets/images/koulutusaste.svg';
import KoulutusTyypitIcon from '#/src/assets/images/koulutustyyppi.svg';
import OpetusKasvatusPsykologiaIcon from '#/src/assets/images/opetus_kasvatus_psykologia.svg';
import SuunniteltuKestoIcon from '#/src/assets/images/suunniteltu_kesto.svg';
import TutkintoNimikeIcon from '#/src/assets/images/tutkintonimike.svg';
import TutkintoonHakeminenIcon from '#/src/assets/images/tutkintoon_hakeminen.svg';
import { colors, educationTypeColorCode } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';

import Spacer from './Spacer';

const iconLookupTable: Record<string, string> = {
  KoulutusAsteIcon: KoulutusAsteIcon,
  KoulutusTyypitIcon: KoulutusTyypitIcon,
  TutkintoNimikeIcon: TutkintoNimikeIcon,
  SuunniteltuKestoIcon: SuunniteltuKestoIcon,
  KoulutuksenLaajuusIcon: KoulutuksenLaajuusIcon,
  TutkintoonHakeminenIcon: TutkintoonHakeminenIcon,
  OpetusKasvatusPsykologiaIcon: OpetusKasvatusPsykologiaIcon,
  ApurahaIcon: ApurahaIcon,
};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '80%',
    backgroundColor: educationTypeColorCode.ammatillinenGreenBg, // TODO: Not sure if this should come from koulutus type theme
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
  },
  text: {
    color: colors.black,
  },
  title: {
    fontWeight: 600,
  },
  grid: {
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
}));

type Props = {
  heading: string;
  gridData: Array<{
    id?: string;
    icon: string | JSX.Element;
    title: string;
    modalText?: JSX.Element | false;
    text: string;
    testid?: string;
  }>;
  className?: string;
};

export const InfoGrid = (props: Props) => {
  const { heading, gridData, className } = props;
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Grid className={classes.grid} container justify="space-evenly" spacing={5}>
          {gridData.map((e, index) => (
            <Grid
              item
              container
              spacing={1}
              xs={12}
              md={6}
              lg={4}
              key={`info-grid-${e.id}-${index}`}>
              <Grid item>
                {_.isString(e.icon) ? (
                  <Icon>
                    <img src={iconLookupTable[e.icon]} alt="" />
                  </Icon>
                ) : (
                  e.icon
                )}
              </Grid>
              <Grid
                item
                xs={10}
                spacing={1}
                alignContent="flex-start"
                container
                direction="column"
                wrap="nowrap">
                <Grid item container spacing={1} wrap="nowrap" alignItems="flex-start">
                  <Grid item>
                    <Typography
                      className={clsx(classes.title, classes.text)}
                      variant="body1"
                      noWrap
                      component="h3">
                      {e.title}
                    </Typography>
                  </Grid>
                  {e?.modalText && (
                    <Grid item>
                      <LabelTooltip title={e?.modalText} />
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  {e.text.split('\n').map((line, i) => (
                    <Typography
                      className={classes.text}
                      component="div"
                      variant="body1"
                      key={i}
                      data-cy={e['testid']}>
                      {line}
                    </Typography>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};
