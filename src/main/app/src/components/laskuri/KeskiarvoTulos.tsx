import React from 'react';

import { Box, Typography, Paper, Link, useTheme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useLaskuriHakukohde } from '#/src/store/reducers/pistelaskuriSlice';
import { styled } from '#/src/theme';

import { kopioiKouluaineetPainokertoimilla, Kouluaineet } from './aine/Kouluaine';
import {
  HakupisteLaskelma,
  LaskelmaTapa,
  lukuaineKeskiarvoPainotettu,
  Osalasku,
} from './Keskiarvo';
import { hasManualPainokertoimia, hasPainokertoimia } from './PisteLaskuriUtil';
import {
  ResultSphere,
  ResultSpheresAmmatillinen,
  ResultSpheresLukio,
} from './ResultSphere';

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
  gridTemplateRows: '1fr auto',
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
      [`& .${classes.osalaskutDisc}`]: {
        minWidth: '10px',
        width: '10px',
        height: '10px',
        borderRadius: 45,
        marginRight: '0.5rem',
        marginTop: '0.5rem',
      },
    },
  },
}));

const LinkToValintaPerusteet = () => {
  const { t } = useTranslation();
  return (
    <Link
      sx={{ fontSize: '0.875rem' }}
      href="/sivu/perusopetuksen-jalkeisen-koulutuksen-yhteishaun-valintaperusteet"
      title={t('pistelaskuri.valintaperusteet.linkki')}>
      <MaterialIcon icon="open_in_new" className={classes.linkIcon} />
      {t('pistelaskuri.valintaperusteet.linkki')}
    </Link>
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
          {t('pistelaskuri.pisteet.osalasku.suoritettu', osalasku)}
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
  embedded: boolean;
  kouluaineet: Kouluaineet;
};

export const KeskiarvoTulos = ({ tulos, embedded, kouluaineet }: Props) => {
  const hakukohde = useLaskuriHakukohde();
  const { t } = useTranslation();

  const showPainokerroinSphere = () =>
    tulos.tapa === LaskelmaTapa.LUKUAINEET &&
    ((hakukohde && hasPainokertoimia(hakukohde)) ||
      (embedded && hasManualPainokertoimia(kouluaineet)));

  const painotettuKeskiarvo = (): number => {
    if (hakukohde) {
      const modifiedAineet = kopioiKouluaineetPainokertoimilla(
        kouluaineet,
        hakukohde.hakukohteenLinja?.painotetutArvosanatOppiaineittain || []
      );
      return lukuaineKeskiarvoPainotettu(modifiedAineet);
    }
    return tulos.keskiarvoPainotettu;
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TulosContainer>
      <Typography variant="h3">{t('pistelaskuri.lukio.header')}</Typography>
      {!isSmall && (
        <Typography variant="h3">{t('pistelaskuri.ammatillinen.header')}</Typography>
      )}
      <Box className={classes.column}>
        {showPainokerroinSphere() ? (
          <ResultSpheresLukio
            keskiarvo={tulos.keskiarvo}
            painotettuKa={painotettuKeskiarvo()}
            embedded={embedded}
          />
        ) : (
          <ResultSphere
            results={[tulos.keskiarvo]}
            text={t('pistelaskuri.pisteet.lukio')}
            embedded={embedded}
          />
        )}
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
      {isSmall && (
        <Typography variant="h3">{t('pistelaskuri.ammatillinen.header')}</Typography>
      )}
      <Box className={classes.column}>
        {tulos.osalasku && (
          <>
            <ResultSpheresAmmatillinen osalasku={tulos.osalasku} embedded={embedded} />
            <Osalaskut osalasku={tulos.osalasku} />
          </>
        )}
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
