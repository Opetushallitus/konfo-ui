import React from 'react';

import { OpenInNew } from '@mui/icons-material';
import { Box, Typography, styled, Paper, List, ListItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

import { HakupisteLaskelma, ENSISIJAINEN_SCORE_BONUS } from './Keskiarvo';

const PREFIX = 'keskiarvo__tulos__';

const classes = {
  column: `${PREFIX}column`,
  resultSphere: `${PREFIX}sphere`,
  spheresContainer: `${PREFIX}spheres`,
  textContainer: `${PREFIX}textcontainer`,
  textBlock: `${PREFIX}textblock`,
  linkIcon: `${PREFIX}linkicon`,
};

const TulosContainer = styled(Box)(() => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  columnGap: '20px',
  [`& .${classes.column}`]: {
    width: '50vw',
  },
  [`& .${classes.resultSphere}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    rowGap: '10px',
    width: '182px',
    height: '182px',
    borderRadius: '50%',
    border: `2px solid #FFCC33`,
    margin: '13px auto 27px',
    textAlign: 'center',
    padding: '0 0.4rem',
  },
  [`& .${classes.spheresContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
  },
  [`& .${classes.textContainer}`]: {
    background: colors.greyBg,
    padding: '1rem',
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
}));

type ResultSphereProps = {
  result: number;
  text: string;
};

const ResultSphere = ({ result, text }: ResultSphereProps) => {
  const resultWithComma = String(result).replace('.', ',');
  return (
    <Box className={classes.resultSphere}>
      <Typography sx={{ fontSize: '3rem', fontWeight: 'bold' }}>
        {resultWithComma}
      </Typography>
      <Typography sx={{ fontSize: '0.875rem' }} variant="body2">
        {text}
      </Typography>
    </Box>
  );
};

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

type Props = {
  tulos: HakupisteLaskelma;
};

export const KeskiarvoTulos = ({ tulos }: Props) => {
  const { t } = useTranslation();
  return (
    <TulosContainer>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.lukio.header')}
      </Typography>
      <Typography variant="h3" sx={{ fontSize: '1.25rem' }}>
        {t('pistelaskuri.ammatillinen.header')}
      </Typography>
      <ResultSphere
        result={tulos.keskiarvo}
        text={t('pistelaskuri.pisteet.lukio')}></ResultSphere>
      <Box className={classes.spheresContainer}>
        <ResultSphere
          result={tulos.pisteet + ENSISIJAINEN_SCORE_BONUS}
          text={t('pistelaskuri.pisteet.ammatillinen-first')}></ResultSphere>
        <ResultSphere
          result={tulos.pisteet}
          text={t('pistelaskuri.pisteet.ammatillinen-rest')}></ResultSphere>
      </Box>
      <Paper className={classes.textContainer} elevation={0}>
        <Typography
          variant="body1"
          className={classes.textBlock}
          sx={{ marginBottom: '0.5rem' }}>
          {t('pistelaskuri.lukio.body')}
        </Typography>
        <LinkToValintaPerusteet></LinkToValintaPerusteet>
      </Paper>
      <Paper className={classes.textContainer} elevation={0}>
        <Typography variant="body1" className={classes.textBlock}>
          {t('pistelaskuri.ammatillinen.huomioitu')}
        </Typography>
        <List sx={{ fontSize: '0.875rem', listStyleType: 'disc', pl: 2 }} dense={true}>
          <ListItem sx={{ display: 'list-item' }}>
            {t('pistelaskuri.ammatillinen.pisteytys-yleinen')}
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            {t('pistelaskuri.ammatillinen.pisteytys-painotettava')}
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            {t('pistelaskuri.ammatillinen.pisteytys-ensisijainen')}
          </ListItem>
        </List>
        <Typography
          variant="body1"
          className={classes.textBlock}
          sx={{ marginBottom: '0.5rem' }}>
          {t('pistelaskuri.ammatillinen.oletus')}
        </Typography>
        <LinkToValintaPerusteet></LinkToValintaPerusteet>
      </Paper>
    </TulosContainer>
  );
};
