import React from 'react';

import { OpenInNew } from '@mui/icons-material';
import { Box, Typography, styled, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

import { HakupisteLaskelma, Osalasku } from './Keskiarvo';
import { ResultSphere, ResultSpheres } from './ResultSphere';

const PREFIX = 'keskiarvo__tulos__';

const classes = {
  column: `${PREFIX}column`,
  textContainer: `${PREFIX}textcontainer`,
  textBlock: `${PREFIX}textblock`,
  linkIcon: `${PREFIX}linkicon`,
  osalaskut: `${PREFIX}osalaskut`,
  osalaskutSection: `${PREFIX}osalaskut__section`,
  osalaskutDisc: `${PREFIX}osalaskut__disc`,
};

const TulosContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '20px',
  h3: {
    fontSize: '1.25rem',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
  },
  [`& .${classes.column}`]: {
    display: 'flex',
    flexDirection: 'column',
    columnGap: '20px',
  },
  [`& .${classes.textContainer}`]: {
    background: colors.greyBg,
    padding: '1rem',
    flexGrow: 2,
  },
  [`& .${classes.textBlock}`]: {
    whiteSpace: 'pre-line',
    fontSize: '0.875rem',
    '&--bottom-margin': {
      marginBottom: '0.5rem',
    },
  },
  [`& .${classes.linkIcon}`]: {
    verticalAlign: 'middle',
    marginRight: '5px',
    marginBottom: '1px',
  },
  [`& .${classes.osalaskut}`]: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '4.5rem',
    paddingRight: '2rem',
    marginBottom: '1.4rem',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '0.3rem',
      paddingRight: '0.3rem',
    },
    [`& .${classes.osalaskutSection}`]: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'top',
      [`& .${classes.osalaskutDisc}`]: {
        width: '10px',
        height: '10px',
        borderRadius: 45,
        marginRight: '0.5rem',
        marginTop: '7px',
      },
    },
  },
}));

const LinkToValintaPerusteet = () => {
  const { t } = useTranslation();
  return (
    <LocalizedLink
      sx={{ fontSize: '0.875rem' }}
      component={RouterLink}
      to="sivu/perusopetuksen-jalkeisen-koulutuksen-yhteishaun-valintaperusteet"
      title={t('pistelaskuri.valintaperusteet.linkki')}>
      <OpenInNew className={classes.linkIcon} />
      {t('pistelaskuri.valintaperusteet.linkki')}
    </LocalizedLink>
  );
};

type OsalaskutProps = {
  osalasku: Osalasku;
};

const Osalaskut = ({ osalasku }: OsalaskutProps) => {
  const { t } = useTranslation();
  return (
    <Box className={classes.osalaskut}>
      <Box className={classes.osalaskutSection}>
        <Box className={classes.osalaskutDisc} sx={{ backgroundColor: colors.sunglow }} />
        <Typography variant="body1" className={classes.textBlock}>
          {t('pistelaskuri.pisteet.osalasku.kaikki', osalasku)}
        </Typography>
      </Box>
      <Box className={classes.osalaskutSection}>
        <Box
          className={classes.osalaskutDisc}
          sx={{ backgroundColor: colors.brandGreen }}
        />
        <Typography variant="body1" className={classes.textBlock}>
          {t('pistelaskuri.pisteet.osalasku.taito', osalasku)}
        </Typography>
      </Box>
      <Box className={classes.osalaskutSection}>
        <Box
          className={classes.osalaskutDisc}
          sx={{ backgroundColor: colors.darkGrey }}
        />
        <Typography
          variant="body1"
          className={classes.textBlock}
          sx={{ lineHeight: '1.3rem' }}>
          {t('pistelaskuri.pisteet.osalasku.suoritettu')}
        </Typography>
      </Box>
      <Box className={classes.osalaskutSection}>
        <Box
          className={classes.osalaskutDisc}
          sx={{ backgroundColor: colors.kkMagenta }}
        />
        <Typography variant="body1" className={classes.textBlock}>
          {t('pistelaskuri.pisteet.osalasku.ensisijainen')}
        </Typography>
      </Box>
    </Box>
  );
};

type Props = {
  tulos: HakupisteLaskelma;
};

export const KeskiarvoTulos = ({ tulos }: Props) => {
  const { t } = useTranslation();
  return (
    <TulosContainer>
      <Box className={classes.column}>
        <Typography variant="h3">{t('pistelaskuri.lukio.header')}</Typography>
        <ResultSphere
          results={[tulos.keskiarvo]}
          text={t('pistelaskuri.pisteet.lukio')}
        />
        <Paper className={classes.textContainer} elevation={0}>
          <Typography
            variant="body1"
            className={classes.textBlock}
            sx={{ marginBottom: '0.5rem' }}>
            {t('pistelaskuri.lukio.body')}
          </Typography>
          <LinkToValintaPerusteet />
        </Paper>
      </Box>
      <Box className={classes.column}>
        <Typography variant="h3">{t('pistelaskuri.ammatillinen.header')}</Typography>
        {tulos.osalasku && <ResultSpheres osalasku={tulos.osalasku} />}
        {tulos.osalasku && <Osalaskut osalasku={tulos.osalasku} />}
        <Paper className={classes.textContainer} elevation={0}>
          <Typography
            variant="body1"
            className={classes.textBlock}
            sx={{ marginBottom: '0.5rem' }}>
            {t('pistelaskuri.ammatillinen.oletus')}
          </Typography>
          <LinkToValintaPerusteet />
        </Paper>
      </Box>
    </TulosContainer>
  );
};
