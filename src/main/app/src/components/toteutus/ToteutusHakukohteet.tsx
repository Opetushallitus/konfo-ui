import React, { useMemo } from 'react';

import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import PinDrop from '@material-ui/icons/PinDrop';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { useDemoLinks } from '#/src/components/toteutus/hooks';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateString, formatDouble } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';
import { Hakukohde } from '#/src/types/HakukohdeTypes';

import { formatAloitus } from './utils';

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: 700,
  },
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: colors.black,
  },
  lomakeButtonGroup: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  paper: {
    width: '100%',
    height: '100%',
    borderTop: `5px solid ${colors.brandGreen}`,
  },
}));

const getJarjestyspaikkaYhteystiedot = (
  jarjestyspaikka: Hakukohde['jarjestyspaikka'],
  osoitteet: Array<{ oppilaitosOid: string; yhteystiedot: string }>
) =>
  osoitteet.find((osoite) => osoite.oppilaitosOid === jarjestyspaikka.oid)?.yhteystiedot;

type GridProps = {
  tyyppiOtsikko: string;
  haut: Array<Hakukohde>;
  icon: JSX.Element;
};

const HakuCardGrid = ({ tyyppiOtsikko, haut, icon }: GridProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { data: demoLinks } = useDemoLinks(haut);

  const oppilaitosOids = useMemo(() => haut.map((haku) => haku.jarjestyspaikka?.oid), [
    haut,
  ]);

  const osoitteet = useOsoitteet(oppilaitosOids, true);

  return (
    <Grid item xs={12}>
      <Box ml={2} display="flex" justifyContent="center">
        {icon}
        <Box ml={2}>
          <Typography variant="h4">{`${tyyppiOtsikko} ( ${haut.length} )`}</Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <Grid container spacing={2} justify="center">
          {haut.map((haku) => {
            const anyHakuaikaPaattyy = haku.hakuajat?.some(
              (hakuaika) => hakuaika.paattyy
            );
            const { alkaaText, alkaaModalText, paattyyText } = formatAloitus(
              haku.koulutuksenAlkamiskausi || {},
              t
            );
            const jarjestyspaikka =
              haku.jarjestyspaikka &&
              [
                localize(haku.jarjestyspaikka.nimi),
                getJarjestyspaikkaYhteystiedot(haku.jarjestyspaikka, osoitteet),
              ]
                .filter(Boolean)
                .join(' · ');

            const ensikertalaisilleText = haku.aloituspaikat?.ensikertalaisille
              ? `, ${t('toteutus.ensikertalaisille', {
                  ensikertalaisille: haku.aloituspaikat?.ensikertalaisille,
                })}`
              : '';

            const aloituspaikatText = haku.aloituspaikat?.lukumaara
              ? haku.aloituspaikat?.lukumaara + ensikertalaisilleText
              : '';

            return (
              <Grid key={haku.hakukohdeOid} item xs={12} lg={8}>
                <Paper className={classes.paper}>
                  <Box m={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography className={classes.hakuName}>
                              {localize(haku.nimi)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <LocalizedHTML data={haku.hakulomakeKuvaus} noMargin />
                          </Grid>
                          {jarjestyspaikka && (
                            <Grid item>
                              <Typography variant="body1">{jarjestyspaikka}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider />
                      </Grid>
                      <Grid item>
                        <Grid container direction="row" spacing={3}>
                          {[
                            {
                              size: anyHakuaikaPaattyy ? 6 : 12,
                              heading: t('toteutus.haku-alkaa:'),
                              content: haku.hakuajat.map((hakuaika) =>
                                formatDateString(new Date(hakuaika.alkaa))
                              ),
                            },
                            anyHakuaikaPaattyy && {
                              size: 6,
                              heading: t('toteutus.haku-paattyy:'),
                              content: haku.hakuajat.map(
                                (hakuaika) =>
                                  hakuaika.paattyy
                                    ? formatDateString(new Date(hakuaika.paattyy))
                                    : '-' // This is needed for the alkuu & paattyy to be rendered on the same row
                              ),
                            },
                            alkaaText && {
                              size: paattyyText ? 6 : 12,
                              heading: t('toteutus.koulutus-alkaa:'),
                              content: [alkaaText],
                              modalText: alkaaModalText,
                            },
                            paattyyText && {
                              size: 6,
                              heading: t('toteutus.koulutus-paattyy:'),
                              content: [paattyyText],
                            },
                            haku.hakukohteenLinja?.alinHyvaksyttyKeskiarvo && {
                              size: 12,
                              heading: t('toteutus.alin-hyvaksytty-keskiarvo'),
                              content: [
                                formatDouble(
                                  haku.hakukohteenLinja.alinHyvaksyttyKeskiarvo,
                                  1
                                ),
                              ],
                            },
                            !_.isEmpty(haku.hakukohteenLinja?.lisatietoa) && {
                              size: 12,
                              heading: t('toteutus.lisätietoa'),
                              content: [],
                              modalText: haku.hakukohteenLinja?.lisatietoa,
                            },
                            {
                              size: 12,
                              heading: t('toteutus.pohjakoulutus:'),
                              content: haku.pohjakoulutusvaatimus.map((vaatimus) =>
                                localize(vaatimus)
                              ),
                              modalText: haku.pohjakoulutusvaatimusTarkenne,
                            },
                            aloituspaikatText && {
                              size: 12,
                              heading: t('toteutus.opiskelupaikkoja:'),
                              content: [aloituspaikatText],
                              modalText: haku.aloituspaikat?.kuvaus,
                            },
                          ]
                            .filter(Boolean)
                            // TODO: filter(Boolean) does not clean the types here :(
                            .map(({ size, heading, content, modalText }: any) => (
                              <Grid key={heading} item xs={size}>
                                <Grid
                                  item
                                  container
                                  spacing={1}
                                  wrap="nowrap"
                                  alignItems="flex-start">
                                  <Grid item>
                                    <Typography className={classes.gridHeading} noWrap>
                                      {heading}
                                    </Typography>
                                  </Grid>
                                  {!_.isEmpty(modalText) && (
                                    <Grid item>
                                      <LabelTooltip
                                        title={
                                          <LocalizedHTML noMargin data={modalText} />
                                        }
                                      />
                                    </Grid>
                                  )}
                                </Grid>
                                <Grid item>
                                  {content.map((v: string, i: number) => (
                                    <Typography
                                      key={`${heading}-text-${i}`}
                                      variant="body1">
                                      {v}
                                    </Typography>
                                  ))}
                                </Grid>
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          className={classes.lomakeButtonGroup}
                          orientation="horizontal"
                          color="primary">
                          {haku.hakulomaketyyppi !== HAKULOMAKE_TYYPPI.EI_SAHKOISTA &&
                            !(
                              !haku.isHakuAuki &&
                              !!demoLinks &&
                              demoLinks.get(haku.hakulomakeAtaruId)
                            ) && (
                              <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                target="_blank"
                                href={localize(haku.hakulomakeLinkki)}
                                disabled={!haku.isHakuAuki}>
                                <Typography
                                  style={{ color: colors.white }}
                                  variant="body1">
                                  {t('toteutus.tayta-lomake')}
                                </Typography>
                              </Button>
                            )}
                          {!!demoLinks && demoLinks.get(haku.hakulomakeAtaruId) && (
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              target="_blank"
                              href={localize(
                                demoLinks.get(haku.hakulomakeAtaruId)?.link
                              )}>
                              <Typography style={{ color: colors.white }} variant="body1">
                                {t('toteutus.tayta-demo-lomake')}
                              </Typography>
                            </Button>
                          )}
                          {haku.valintaperusteId && (
                            <Button variant="outlined" size="large" color="primary">
                              <LocalizedLink
                                tabIndex={-1}
                                underline="none"
                                component={RouterLink}
                                to={`/hakukohde/${haku.hakukohdeOid}/valintaperuste`}>
                                <Typography
                                  style={{ color: colors.brandGreen }}
                                  variant="body1">
                                  {t('toteutus.lue-valintaperusteet')}
                                </Typography>
                              </LocalizedLink>
                            </Button>
                          )}
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};

const typeToIconMap = {
  hakutapa_01: CalendarTodayOutlinedIcon, // Yhteishaku
  hakutapa_02: PinDrop, // Erillishaku
  hakutapa_03: AutorenewIcon, // Jatkuva haku
  hakutapa_04: AutorenewIcon, // Joustava haku
  // TODO: hakutapa_05 + 06: Lisähaku / Siirtohaku (järjestys selvitettävä)
};

const getHakutyyppiIcon = (koodiUri: keyof typeof typeToIconMap) =>
  typeToIconMap[koodiUri] || CalendarTodayOutlinedIcon;

type Props = {
  haut: Record<string, { nimi: Translateable; hakukohteet: Array<Hakukohde> }>;
};

export const ToteutusHakukohteet = ({ haut }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12} sm={12} md={10} lg={8}>
      <Box pt={12} display="flex" flexDirection="column" alignItems="center" id="haut">
        <Typography variant="h2">{t('toteutus.koulutuksen-hakukohteet')}</Typography>
        <Spacer />
        <Grid container direction="column" spacing={6}>
          {_.map(haut, (haku, key) => {
            const IconComponent = getHakutyyppiIcon(key as keyof typeof typeToIconMap);
            return (
              <HakuCardGrid
                tyyppiOtsikko={localize(haku)}
                haut={haku.hakukohteet}
                icon={<IconComponent />}
                key={key}
              />
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};
