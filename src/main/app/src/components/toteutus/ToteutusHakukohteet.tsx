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
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors } from '#/src/colors';
import { AdditionalInfoWithIcon } from '#/src/components/common/AdditionalInfoWithIcon';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { PageSection } from '#/src/components/common/PageSection';
import { useDemoLinks } from '#/src/components/toteutus/hooks';
import { Hakulomaketyyppi } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateString, formatDouble } from '#/src/tools/utils';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { HakutietoTable } from './HakutietoTable';
import { formatAloitus } from './utils';

export const useStyles = makeStyles((theme) => ({
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
    maxWidth: '800px',
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
  icon: JSX.Element;
  toteutus?: Toteutus;
  hakukohteet: Array<Hakukohde>;
};

const HakuCardGrid = ({ tyyppiOtsikko, icon, toteutus, hakukohteet }: GridProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { data: demoLinks } = useDemoLinks(hakukohteet);

  const oppilaitosOids = useMemo(
    () => hakukohteet.map((hakukohde) => hakukohde.jarjestyspaikka?.oid),
    [hakukohteet]
  );

  const toteutuksenAlkamiskausi = toteutus?.metadata?.opetus?.koulutuksenAlkamiskausi;

  const hakutermi = toteutus?.metadata?.hakutermi;

  const { osoitteet } = useOsoitteet(oppilaitosOids, true);

  return (
    <Box marginY={3}>
      <Box ml={2} display="flex" justifyContent="center">
        {icon}
        <Box ml={2}>
          <Typography variant="h4">{`${tyyppiOtsikko} ( ${hakukohteet.length} )`}</Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <Grid container spacing={2} justifyContent="center">
          {hakukohteet.map((hakukohde) => {
            const anyHakuaikaPaattyy = hakukohde.hakuajat?.some(
              (hakuaika) => hakuaika.paattyy
            );
            const { alkaaText, alkaaModalText, paattyyText } = formatAloitus(
              hakukohde.koulutuksenAlkamiskausi || toteutuksenAlkamiskausi || {},
              t
            );
            const jarjestyspaikka =
              hakukohde.jarjestyspaikka &&
              [
                localize(hakukohde.jarjestyspaikka.nimi),
                getJarjestyspaikkaYhteystiedot(hakukohde.jarjestyspaikka, osoitteet),
              ]
                .filter(Boolean)
                .join(' · ');

            const jarjestaaUrheilijanAmmKoulutusta =
              hakukohde.jarjestyspaikka?.jarjestaaUrheilijanAmmKoulutusta;

            const ensikertalaisilleText = hakukohde.aloituspaikat?.ensikertalaisille
              ? `, ${t('toteutus.ensikertalaisille', {
                  ensikertalaisille: hakukohde.aloituspaikat?.ensikertalaisille,
                })}`
              : '';

            const aloituspaikatText = hakukohde.aloituspaikat?.lukumaara
              ? hakukohde.aloituspaikat?.lukumaara + ensikertalaisilleText
              : '';

            return (
              <Grid key={hakukohde.hakukohdeOid} item xs={12}>
                <Paper className={classes.paper}>
                  <Box m={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography className={classes.hakuName}>
                              {localize(hakukohde.nimi)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <LocalizedHTML data={hakukohde.hakulomakeKuvaus} noMargin />
                          </Grid>
                          {jarjestyspaikka && (
                            <Grid item>
                              <Typography variant="body1">{jarjestyspaikka}</Typography>
                            </Grid>
                          )}
                          {jarjestaaUrheilijanAmmKoulutusta && (
                            <AdditionalInfoWithIcon
                              translationKey="haku.urheilijan-amm-koulutus"
                              icon={<SportsSoccerIcon />}
                            />
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Divider />
                      </Grid>
                      <Grid item>
                        <HakutietoTable
                          items={[
                            {
                              size: anyHakuaikaPaattyy ? 6 : 12,
                              heading:
                                hakutermi === 'hakeutuminen'
                                  ? t('toteutus.haku-alkaa:')
                                  : t('toteutus.ilmoittautuminen-alkaa:'),
                              content: hakukohde.hakuajat.map((hakuaika) =>
                                formatDateString(hakuaika.formatoituAlkaa)
                              ),
                            },
                            anyHakuaikaPaattyy && {
                              size: 6,
                              heading:
                                hakutermi === 'hakeutuminen'
                                  ? t('toteutus.haku-paattyy:')
                                  : t('toteutus.ilmoittautuminen-paattyy:'),
                              content: hakukohde.hakuajat.map(
                                (hakuaika) =>
                                  hakuaika.paattyy
                                    ? formatDateString(hakuaika.formatoituPaattyy)
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
                            hakukohde.hakukohteenLinja?.alinHyvaksyttyKeskiarvo && {
                              size: 12,
                              heading: t('toteutus.alin-hyvaksytty-keskiarvo'),
                              content: [
                                formatDouble(
                                  hakukohde.hakukohteenLinja.alinHyvaksyttyKeskiarvo,
                                  2
                                ),
                              ],
                            },
                            !_.isEmpty(hakukohde.hakukohteenLinja?.lisatietoa) && {
                              size: 12,
                              heading: t('toteutus.lisätietoa'),
                              content: [],
                              modalText: hakukohde.hakukohteenLinja?.lisatietoa,
                            },
                            {
                              size: 12,
                              heading: t('toteutus.pohjakoulutus:'),
                              content: hakukohde.pohjakoulutusvaatimus.map((vaatimus) =>
                                localize(vaatimus)
                              ),
                              modalText: hakukohde.pohjakoulutusvaatimusTarkenne,
                            },
                            aloituspaikatText && {
                              size: 12,
                              heading: t('toteutus.opiskelupaikkoja:'),
                              content: [aloituspaikatText],
                              modalText: hakukohde.aloituspaikat?.kuvaus,
                            },
                          ]}
                        />
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          className={classes.lomakeButtonGroup}
                          orientation="horizontal"
                          color="primary">
                          {hakukohde.hakulomaketyyppi !== Hakulomaketyyppi.EI_SAHKOISTA &&
                            !(
                              !hakukohde.isHakuAuki &&
                              !!demoLinks &&
                              !!demoLinks.get(hakukohde.hakulomakeAtaruId)
                            ) && (
                              <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                target="_blank"
                                href={localize(hakukohde.hakulomakeLinkki)}
                                disabled={!hakukohde.isHakuAuki}>
                                <Typography
                                  style={{ color: colors.white }}
                                  variant="body1">
                                  {t('toteutus.tayta-lomake')}
                                </Typography>
                              </Button>
                            )}
                          {!!demoLinks && demoLinks.get(hakukohde.hakulomakeAtaruId) && (
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              target="_blank"
                              href={localize(
                                demoLinks
                                  .get(hakukohde.hakulomakeAtaruId)
                                  ?.get(hakukohde.hakukohdeOid)
                              )}>
                              <Typography style={{ color: colors.white }} variant="body1">
                                {t('toteutus.tayta-demo-lomake')}
                              </Typography>
                            </Button>
                          )}
                          {(hakukohde.valintaperusteId ||
                            hakukohde.hasValintaperustekuvausData) && (
                            <Button variant="outlined" size="large" color="primary">
                              <LocalizedLink
                                tabIndex={-1}
                                underline="none"
                                component={RouterLink}
                                to={`/hakukohde/${hakukohde.hakukohdeOid}/valintaperuste`}>
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
    </Box>
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
  toteutus?: Toteutus;
};

export const ToteutusHakukohteet = ({ toteutus }: Props) => {
  const { t } = useTranslation();

  const hakukohteetByHakutapa = toteutus?.hakukohteetByHakutapa;

  const sortedByHakutapaAndHakuaika = _.sortBy(_.toPairs(hakukohteetByHakutapa), ([hakutapa]) => {
    return Number(_.get(hakutapa?.split("_"), 1));
  }, ([, haku]) => {
    const isAuki = _.some(haku.hakukohteet, ["isHakuAuki", true]);
    const isMennyt = _.every(haku.hakukohteet, ["isHakuMennyt", true]);
    return isAuki ? 0 : (isMennyt ? 2 : 1);
  });

  return (
    <Grid item xs={12} sm={12} md={10} lg={8}>
      <PageSection heading={t('toteutus.koulutuksen-hakukohteet')}>
        <Grid direction="column" spacing={6}>
          {_.map(sortedByHakutapaAndHakuaika, ([hakutapaKoodiUri, h]) => {
            const IconComponent = getHakutyyppiIcon(
              hakutapaKoodiUri as keyof typeof typeToIconMap
            );
            const hks = _.sortBy(h.hakukohteet, hk => {
              return hk.isHakuAuki ? 0 : (hk.isHakuMennyt ? 2 : 1);
            });

            return (
              <HakuCardGrid
                tyyppiOtsikko={localize(h)}
                toteutus={toteutus}
                hakukohteet={hks}
                icon={<IconComponent />}
                key={hakutapaKoodiUri}
              />
            );
          })}
        </Grid>
      </PageSection>
    </Grid>
  );
};
