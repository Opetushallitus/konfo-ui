import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  isEmpty,
  sortBy,
  toPairs,
  some,
  every,
  map,
  get,
  find,
  uniqueId,
  kebabCase,
} from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { AdditionalInfoWithIcon } from '#/src/components/common/AdditionalInfoWithIcon';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { MaterialIcon, createMaterialIcon } from '#/src/components/common/MaterialIcon';
import { PageSection } from '#/src/components/common/PageSection';
import { ToggleSuosikkiButton } from '#/src/components/common/ToggleSuosikkiButton';
import { useDemoLinks } from '#/src/components/toteutus/hooks';
import { Hakulomaketyyppi, TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO } from '#/src/constants';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { formatDouble } from '#/src/tools/utils';
import { Hakukohde } from '#/src/types/HakukohdeTypes';
import { Hakutieto, OppilaitosOsa, Toteutus } from '#/src/types/ToteutusTypes';

import { HakutietoTable } from './HakutietoTable';
import { formatAloitus } from './utils';

const PREFIX = 'ToteutusHakukohteet';

const classes = {
  hakuName: `${PREFIX}-hakuName`,
  lomakeButtonGroup: `${PREFIX}-lomakeButtonGroup`,
  paper: `${PREFIX}-paper`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  '&> div': {
    flexBasis: 'unset',
  },
  [`& .${classes.hakuName}`]: {
    fontWeight: 700,
    color: colors.grey900,
    display: 'inline',
  },

  [`& .${classes.lomakeButtonGroup}`]: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },

  [`& .${classes.paper}`]: {
    width: '100vw',
    maxWidth: '800px',
    height: '100%',
    borderTop: `5px solid ${colors.brandGreen}`,
  },
}));

type GridProps = {
  tyyppiOtsikko: string;
  icon: React.JSX.Element;
  toteutus?: Toteutus;
  hakukohteet: Array<Hakukohde & { kohdejoukko: Hakutieto['kohdejoukko'] }>;
  oppilaitosOsat?: Array<OppilaitosOsa>;
};

const isToisenAsteenYhteishaku = (hakutieto: { kohdejoukko: Hakutieto['kohdejoukko'] }) =>
  hakutieto.kohdejoukko?.koodiUri?.includes(TOISEN_ASTEEN_YHTEISHAUN_KOHDEJOUKKO);

const HakuCardGrid = ({
  tyyppiOtsikko,
  icon,
  toteutus,
  hakukohteet,
  oppilaitosOsat,
}: GridProps) => {
  const { t } = useTranslation();

  const { data: demoLinks } = useDemoLinks(hakukohteet);

  const toteutuksenAlkamiskausi = toteutus?.metadata?.opetus?.koulutuksenAlkamiskausi;

  const hakutermi = toteutus?.metadata?.hakutermi;

  const { isDraft } = useUrlParams();
  function getFullToimipisteNimi(oid: string) {
    const toimipiste = find(
      oppilaitosOsat,
      (opOsa) => get(opOsa, 'oid', 'toimipiste oid not found') === oid
    );
    const parentToimipiste = find(
      oppilaitosOsat,
      (opOsa) =>
        get(opOsa, 'oid', 'toimipisteNotFound') ===
        get(toimipiste, 'parentToimipisteOid', 'parentNotFound')
    );
    return [parentToimipiste, toimipiste]
      .filter(Boolean)
      .map((tp) => localize(tp))
      .join(', ');
  }

  const headingId = uniqueId('heading_' + kebabCase(tyyppiOtsikko));

  return (
    <Box marginY={3}>
      <Box ml={2} display="flex" justifyContent="center">
        {icon}
        <Box ml={2}>
          <Typography
            id={headingId}
            variant="h4">{`${tyyppiOtsikko} ( ${hakukohteet.length} )`}</Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <StyledGrid
          role="list"
          container
          spacing={2}
          justifyContent="center"
          aria-labelledby={headingId}>
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
              (getFullToimipisteNimi(hakukohde.jarjestyspaikka.oid) ||
                localize(hakukohde.jarjestyspaikka));

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
              <Grid key={hakukohde.hakukohdeOid} item xs={12} role="listitem">
                <Paper className={classes.paper}>
                  <Box m={4}>
                    <Grid container spacing={3} display="flex" flexDirection="column">
                      <Grid item display="inline-block" position="relative">
                        {isToisenAsteenYhteishaku(hakukohde) && (
                          <Box sx={{ float: 'right', marginLeft: 1 }}>
                            <ToggleSuosikkiButton
                              hakukohdeOid={hakukohde.hakukohdeOid}
                              notifyOnAdd={true}
                            />
                          </Box>
                        )}
                        <Typography
                          variant="h5"
                          component="div"
                          className={classes.hakuName}>
                          {localize(hakukohde.nimi)}
                        </Typography>
                        {!isEmpty(hakukohde.hakulomakeKuvaus) && (
                          <LocalizedHTML data={hakukohde.hakulomakeKuvaus} noMargin />
                        )}
                        {jarjestyspaikka && (
                          <Typography component="div" variant="body1">
                            {jarjestyspaikka}
                          </Typography>
                        )}
                        {jarjestaaUrheilijanAmmKoulutusta && (
                          <Box mt={1}>
                            <AdditionalInfoWithIcon
                              translationKey="haku.urheilijan-amm-koulutus"
                              icon={<MaterialIcon icon="sports_soccer" />}
                            />
                          </Box>
                        )}
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
                                hakutermi === 'ilmoittautuminen'
                                  ? t('toteutus.ilmoittautuminen-alkaa:')
                                  : t('toteutus.haku-alkaa:'),
                              content: hakukohde.hakuajat.map((hakuaika) =>
                                localize(hakuaika.formatoituAlkaa)
                              ),
                            },
                            anyHakuaikaPaattyy && {
                              size: 6,
                              heading:
                                hakutermi === 'ilmoittautuminen'
                                  ? t('toteutus.ilmoittautuminen-paattyy:')
                                  : t('toteutus.haku-paattyy:'),
                              content: hakukohde.hakuajat.map(
                                (hakuaika) =>
                                  hakuaika.paattyy
                                    ? localize(hakuaika.formatoituPaattyy)
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
                            !isEmpty(hakukohde.hakukohteenLinja?.lisatietoa) && {
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
                              demoLinks?.get(hakukohde.hakulomakeAtaruId)
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
                          {demoLinks && demoLinks.get(hakukohde.hakulomakeAtaruId) && (
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
                            <Button
                              variant="outlined"
                              size="large"
                              color="primary"
                              href={`/hakukohde/${hakukohde.hakukohdeOid}/valintaperuste`.concat(
                                isDraft ? '?draft=true' : ''
                              )}>
                              <Typography
                                style={{ color: colors.brandGreen }}
                                variant="body1">
                                {t('toteutus.lue-valintaperusteet')}
                              </Typography>
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
        </StyledGrid>
      </Box>
    </Box>
  );
};

const CalendarTodayOutlinedIcon = createMaterialIcon('calendar_today', 'outlined');
const AutorenewIcon = createMaterialIcon('calendar_today', 'outlined');

const typeToIconMap = {
  hakutapa_01: CalendarTodayOutlinedIcon, // Yhteishaku
  hakutapa_02: createMaterialIcon('pin_drop'), // Erillishaku
  hakutapa_03: AutorenewIcon, // Jatkuva haku
  hakutapa_04: AutorenewIcon, // Joustava haku
  // TODO: hakutapa_05 + 06: Lisähaku / Siirtohaku (järjestys selvitettävä)
};

const getHakutyyppiIcon = (koodiUri: keyof typeof typeToIconMap) =>
  typeToIconMap[koodiUri] || CalendarTodayOutlinedIcon;

type Props = {
  toteutus?: Toteutus;
  oppilaitosOsat?: Array<OppilaitosOsa>;
};

export const ToteutusHakukohteet = ({ toteutus, oppilaitosOsat }: Props) => {
  const { t } = useTranslation();

  const hakukohteetByHakutapa = toteutus?.hakukohteetByHakutapa;

  const sortedByHakutapaAndHakuaika = sortBy(
    toPairs(hakukohteetByHakutapa),
    ([hakutapa]) => {
      return Number(hakutapa?.split('_')?.[1]);
    },
    ([, haku]) => {
      const isAuki = some(haku.hakukohteet, ['isHakuAuki', true]);
      const isMennyt = every(haku.hakukohteet, ['isHakuMennyt', true]);
      return isAuki ? 0 : isMennyt ? 2 : 1;
    }
  );

  return (
    <Grid item xs={12} sm={12} md={10} lg={8}>
      <PageSection heading={t('toteutus.koulutuksen-hakukohteet')}>
        <Grid container direction="column" spacing={2}>
          {map(sortedByHakutapaAndHakuaika, ([hakutapaKoodiUri, h]) => {
            const IconComponent = getHakutyyppiIcon(
              hakutapaKoodiUri as keyof typeof typeToIconMap
            );
            const hks = sortBy(h.hakukohteet, (hk) => {
              return hk.isHakuAuki ? 0 : hk.isHakuMennyt ? 2 : 1;
            });

            return (
              <HakuCardGrid
                tyyppiOtsikko={localize(h)}
                toteutus={toteutus}
                hakukohteet={hks}
                icon={<IconComponent />}
                key={hakutapaKoodiUri}
                oppilaitosOsat={oppilaitosOsat}
              />
            );
          })}
        </Grid>
      </PageSection>
    </Grid>
  );
};
