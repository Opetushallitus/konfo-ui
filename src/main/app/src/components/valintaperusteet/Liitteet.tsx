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
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { ExternalLink } from '#/src/components/common/ExternalLink';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { localize, localizeOsoite } from '#/src/tools/localization';
import { useOsoitteet } from '#/src/tools/useOppilaitosOsoite';
import { formatDateString, toId } from '#/src/tools/utils';
import { Yhteystiedot } from '#/src/types/common';
import { Hakukohde, Liite, FormatoituAikaleima } from '#/src/types/HakukohdeTypes';

const LIITTEEN_TOIMITUSTAPA = {
  TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA: 'lomake',
  JARJESTAJAN_OSOITE: 'hakijapalvelu',
  MUU_OSOITE: 'osoite',
};

const FileIcon = withStyles(() => ({
  root: {
    color: colors.brandGreen,
    marginTop: 12,
  },
}))(InsertDriveFileOutlinedIcon);

type ToimituspaikkaProps = {
  postiosoite?: string;
  sahkoposti?: string;
  verkkosivu?: string;
  missingMsgKey?: string;
};

const Toimituspaikka = ({
  postiosoite,
  sahkoposti,
  verkkosivu,
  missingMsgKey,
}: ToimituspaikkaProps) => {
  const { t } = useTranslation();
  const missing =
    _.isEmpty(postiosoite) && _.isEmpty(sahkoposti) && _.isEmpty(verkkosivu);
  return missing ? (
    missingMsgKey ? (
      <Typography>{t(missingMsgKey)}</Typography>
    ) : null
  ) : (
    <Box m={1}>
      <Heading variant="h5">{t('valintaperuste.toimituspaikka')}</Heading>
      {postiosoite && (
        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
          {postiosoite}
        </Typography>
      )}
      {sahkoposti && (
        <Box marginTop={1}>
          <Typography variant="body1">{sahkoposti}</Typography>
        </Box>
      )}
      {verkkosivu && (
        <Box marginTop={1}>
          <ExternalLink href={verkkosivu}>
            {t('valintaperuste.liitteenToimitusosoiteVerkkosivu')}
          </ExternalLink>
        </Box>
      )}
    </Box>
  );
};

type ToimituspaikkaByToimitustapaProps = {
  toimitustapa: string;
  toimitusosoite: Liite['toimitusosoite'];
  hakijapalveluidenYhteystiedot?: Yhteystiedot;
};
const ToimituspaikkaByToimitustapa = ({
  toimitustapa,
  toimitusosoite,
  hakijapalveluidenYhteystiedot,
}: ToimituspaikkaByToimitustapaProps) => {
  const { t } = useTranslation();

  switch (toimitustapa) {
    case LIITTEEN_TOIMITUSTAPA.JARJESTAJAN_OSOITE:
      const postiosoiteObject = hakijapalveluidenYhteystiedot?.postiosoite;
      return (
        <Toimituspaikka
          postiosoite={localizeOsoite(
            postiosoiteObject?.osoite,
            postiosoiteObject?.postinumero,
            '\n'
          )}
          sahkoposti={localize(hakijapalveluidenYhteystiedot?.sahkoposti)}
          missingMsgKey="valintaperuste.hakijapalveluiden-yhteystiedot-puuttuvat"
        />
      );
    case LIITTEEN_TOIMITUSTAPA.TOIMITETAAN_LAHETTAMISEN_YHTEYDESSA:
      return <Typography>{t('valintaperuste.liite-toimitustapa-lomake')}</Typography>;
    case LIITTEEN_TOIMITUSTAPA.MUU_OSOITE:
      return (
        <Toimituspaikka
          postiosoite={localizeOsoite(
            toimitusosoite?.osoite?.osoite,
            toimitusosoite?.osoite?.postinumero,
            '\n'
          )}
          sahkoposti={toimitusosoite?.sahkoposti}
          verkkosivu={toimitusosoite?.verkkosivu}
        />
      );
    default:
      return null;
  }
};

type LiiteCardProps = {
  liitteet: Array<Liite>;
  toimitustapa: string;
  toimitusosoite: Liite['toimitusosoite'];
  toimitusaika: FormatoituAikaleima;
  hakijapalveluidenYhteystiedot?: Yhteystiedot;
};

const LiiteCard = ({
  liitteet,
  toimitustapa,
  toimitusosoite,
  toimitusaika,
  hakijapalveluidenYhteystiedot,
}: LiiteCardProps) => {
  const { t } = useTranslation();
  return (
    <Box py={2}>
      <HeadingBoundary>
        <Card elevation={2}>
          <CardContent>
            <Grid container>
              {liitteet.map(({ nimi, kuvaus }, i) => (
                <Grid container key={`liite-${nimi}-${i}`}>
                  <Grid item container xs={2} justifyContent="flex-end">
                    <FileIcon />
                  </Grid>
                  <Grid item xs={10}>
                    <Box m={1}>
                      <Heading variant="h5">{localize(nimi)}</Heading>
                      <LocalizedHTML data={kuvaus} />
                    </Box>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Box m={1}>
                  <Divider />
                </Box>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={10}>
                <ToimituspaikkaByToimitustapa
                  toimitustapa={toimitustapa}
                  toimitusosoite={toimitusosoite}
                  hakijapalveluidenYhteystiedot={hakijapalveluidenYhteystiedot}
                />
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

type Props = {
  liitteet: Array<Liite>;
  hakukohde: Hakukohde;
  organisaatioOid: string;
};

export const Liitteet = ({ liitteet, hakukohde, organisaatioOid }: Props) => {
  const { t } = useTranslation();
  const liitteetTyypeittain = tyypeittain(liitteet);
  const { hakijapalveluidenYhteystiedot } = useOsoitteet([organisaatioOid])?.[0] || {};

  const yhteinenToimitusaika =
    hakukohde?.liitteetOnkoSamaToimitusaika &&
    hakukohde?.formatoituLiitteidentoimitusaika;
  const yhteinenToimitusosoite =
    hakukohde.liitteetOnkoSamaToimitusosoite && hakukohde.liitteidenToimitusosoite;

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
                  toimitustapa={hakukohde.liitteidenToimitustapa}
                  toimitusaika={yhteinenToimitusaika}
                  toimitusosoite={yhteinenToimitusosoite}
                  hakijapalveluidenYhteystiedot={hakijapalveluidenYhteystiedot}
                />
              ) : (
                values.map((liite, index) => (
                  <LiiteCard
                    key={`liite-${index}`}
                    liitteet={[liite]}
                    toimitustapa={hakukohde.liitteidenToimitustapa || liite.toimitustapa}
                    toimitusaika={yhteinenToimitusaika || liite.formatoituToimitusaika}
                    toimitusosoite={yhteinenToimitusosoite || liite.toimitusosoite}
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
