import React from 'react';

import { Grid, Icon, Paper, Typography } from '@mui/material';
import clsx from 'clsx';
import { isString } from 'lodash';

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
import { styled } from '#/src/theme';
import { toId } from '#/src/tools/utils';

const PREFIX = 'InfoGrid';

const classes = {
  paper: `${PREFIX}-paper`,
  text: `${PREFIX}-text`,
  title: `${PREFIX}-title`,
  grid: `${PREFIX}-grid`,
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-evenly',
  width: '100%',
  backgroundColor: educationTypeColorCode.ammatillinenGreenBg, // TODO: Not sure if this should come from koulutus type theme

  [`& .${classes.text}`]: {
    color: colors.grey900,
  },

  [`& .${classes.title}`]: {
    fontWeight: 600,
  },

  [`& .${classes.grid}`]: {
    padding: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
}));

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

type Props = {
  gridData: Array<{
    id?: string;
    icon: string | React.JSX.Element;
    title: string;
    modalText?: React.JSX.Element | false;
    text: string;
    testid?: string;
  }>;
};

export const InfoGrid = (props: Props) => {
  const { gridData } = props;

  return (
    <StyledPaper className={classes.paper}>
      <Grid className={classes.grid} container justifyContent="space-evenly" spacing={5}>
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
              {isString(e.icon) ? (
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
                    id={toId(e.title)}>
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
                    data-testid={e['testid']}
                    aria-labelledby={toId(e.title)}>
                    {line}
                  </Typography>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </StyledPaper>
  );
};
