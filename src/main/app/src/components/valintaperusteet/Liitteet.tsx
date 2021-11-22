import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  withStyles,
} from '@material-ui/core';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { TFunction } from 'i18next';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { localize, localizeOsoite } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateString, toId } from '#/src/tools/utils';
import { Hakukohde, Liite } from '#/src/types/HakukohdeTypes';

const LIITTEEN_TOIMITUSTAPA = {
  TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA: 'lomake',
  JARJESTAJAN_OSOITE: 'hakijapalvelu',
  MUU_OSOITE: 'osoite',
};

const yhteystiedotAsString = (
  {
    sahkoposti,
    osoite: { osoite, postinumero } = {} as any,
  }: Liite['toimitusosoite'] = {} as any
) => [sahkoposti, localizeOsoite(osoite, postinumero)].filter(Boolean).join(' · ');

const FileIcon = withStyles(() => ({
  root: {
    color: colors.brandGreen,
    marginTop: 12,
  },
}))(InsertDriveFileOutlinedIcon);

type LiiteCardProps = {
  liitteet: Array<Liite>;
  osoite: string;
  toimitusaika: string;
  verkkosivu?: string;
};

const LiiteCard = ({ liitteet, osoite, toimitusaika, verkkosivu }: LiiteCardProps) => {
  const { t } = useTranslation();

  return (
    <Box py={2}>
      <HeadingBoundary>
        <Card elevation={2}>
          <CardContent>
            <Grid container>
              {liitteet.map(({ nimi, kuvaus }, i) => (
                <React.Fragment key={`liite-${nimi}-${i}`}>
                  <Grid container>
                    <Grid item container xs={2} justify="flex-end">
                      <FileIcon />
                    </Grid>
                    <Grid item xs={10}>
                      <Box m={1}>
                        <Heading variant="h5">{localize(nimi)}</Heading>
                        <LocalizedHTML data={kuvaus} />
                      </Box>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Box m={1}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={10}>
                <Box m={1}>
                  <Heading variant="h5">{t('valintaperuste.toimituspaikka')}</Heading>
                  <Typography variant="body1">{osoite}</Typography>
                  {verkkosivu && (
                    <ExternalLink href={verkkosivu}>
                      {t('valintaperuste.toimitusosoiteVerkkosivu')}
                    </ExternalLink>
                  )}
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={10}>
                <Box m={1}>
                  <Heading variant="h5">
                    {t('valintaperuste.toimitettava-viimeistään')}
                  </Heading>
                  <Typography variant="body1">
                    {formatDateString(toimitusaika)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </HeadingBoundary>
    </Box>
  );
};

const tyypeittain = (liitteet: Array<Liite>) =>
  _.groupBy(liitteet || [], (liite) => localize(liite?.tyyppi));

const getToimitusosoite = (
  toimitustapa: string,
  toimitusOsoite: Liite['toimitusosoite'],
  hakijapalveluidenYhteystiedot: any = {},
  t: TFunction
) => {
  switch (toimitustapa) {
    case LIITTEEN_TOIMITUSTAPA.JARJESTAJAN_OSOITE:
      const usedYhteystiedot = [
        localize(hakijapalveluidenYhteystiedot.sahkoposti),
        hakijapalveluidenYhteystiedot.yhteystiedot,
      ]
        .filter(Boolean)
        .join(' · ');
      return (
        usedYhteystiedot || t('valintaperuste.hakijapalveluiden-yhteystiedot-puuttuvat')
      );
    case LIITTEEN_TOIMITUSTAPA.TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA:
      return t('valintaperuste.liite-toimitustapa-lomake');
    case LIITTEEN_TOIMITUSTAPA.MUU_OSOITE:
      return yhteystiedotAsString(toimitusOsoite);
  }
};

type Props = {
  liitteet: Array<Liite>;
  hakukohde: Hakukohde;
  organisaatioOid: string;
};

export const Liitteet = ({ liitteet, hakukohde, organisaatioOid }: Props) => {
  const { t } = useTranslation();
  const liitteetTyypeittain = tyypeittain(liitteet);
  const { hakijapalveluidenYhteystiedot } = useOsoitteet([organisaatioOid])?.[0] || {};

  const yhteinenToimitusaika = hakukohde?.liitteetOnkoSamaToimitusaika
    ? hakukohde?.liitteidenToimitusaika
    : null;
  const yhteinenToimitusosoite = hakukohde.liitteetOnkoSamaToimitusosoite
    ? getToimitusosoite(
        hakukohde.liitteidenToimitustapa,
        hakukohde.liitteidenToimitusosoite,
        hakijapalveluidenYhteystiedot,
        t
      )
    : null;

  return (
    <Grid item container direction="column" xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <HeadingBoundary>
        <Heading id={toId(t('valintaperuste.liitteet'))} variant="h2">
          {t('valintaperuste.liitteet')}
        </Heading>
        {_.map(liitteetTyypeittain, (values, tyyppi) => (
          <div key={`liitteet-${tyyppi}`}>
            <HeadingBoundary>
              <Box py={2}>
                <Heading id={toId(tyyppi)} variant="h4">
                  {tyyppi}
                </Heading>
              </Box>
              {/* Jos liitteillä on yhteinen osoite JA aika, rendataan ne lyhyempinä listoina
              Muuten jokainen liite rendataan omana korttinaan */}
              {yhteinenToimitusaika && yhteinenToimitusosoite ? (
                <LiiteCard
                  liitteet={values}
                  osoite={yhteinenToimitusosoite!}
                  toimitusaika={yhteinenToimitusaika!}
                  verkkosivu={hakukohde?.liitteidenToimitusosoite?.verkkosivu}
                />
              ) : (
                values.map((liite, index) => (
                  <LiiteCard
                    key={`liite-${index}`}
                    liitteet={[liite]}
                    osoite={
                      yhteinenToimitusosoite ||
                      getToimitusosoite(
                        liite.toimitustapa,
                        liite.toimitusosoite,
                        hakijapalveluidenYhteystiedot,
                        t
                      )!
                    }
                    toimitusaika={yhteinenToimitusaika || liite.toimitusaika}
                    verkkosivu={liite?.toimitusosoite?.verkkosivu}
                  />
                ))
              )}
            </HeadingBoundary>
          </div>
        ))}
      </HeadingBoundary>
    </Grid>
  );
};
