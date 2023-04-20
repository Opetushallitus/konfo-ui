import React, { useMemo } from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import Spacer from '#/src/components/common/Spacer';
import { useOppilaitokset } from '#/src/components/oppilaitos/hooks';
import { hasYhteystiedot, Yhteystiedot } from '#/src/components/oppilaitos/Yhteystiedot';
import { localize } from '#/src/tools/localization';
import { Organisaatio } from '#/src/types/ToteutusTypes';

// NOTE: In most cases there is only one oppilaitos per KOMOTO but there is no limit in data model
export const ToteutuksenYhteystiedot = ({
  oids,
  tarjoajat,
}: {
  oids: Array<string>;
  tarjoajat: Array<Organisaatio> | undefined;
}) => {
  const { t } = useTranslation();
  const oppilaitokset = useOppilaitokset({
    isOppilaitosOsa: false,
    oids,
  });
  const filtered = useMemo(
    () =>
      oppilaitokset
        .filter(
          (v) =>
            !isEmpty(v.data.metadata?.wwwSivu) ||
            !isEmpty(v.data.metadata?.esittely) ||
            hasYhteystiedot(v.data.metadata)
        )
        .map((v) => v.data),
    [oppilaitokset]
  );

  //Näytetään toteutukselle vain yhdet hakijapalveluiden yhteystiedot. Ensisijaisesti oppilaitoksen osalta, sen jälkeen oppilaitokselta.
  //Tämä sisältää oletuksen, että jos toteutukseen liittyvät oidit sisältävät oppilaitoksen osan, se sisältää osuvammat yhteystiedot.
  const kaytettavatHakijapalveluidenYhteystiedot = useMemo(() => {
    const oppilaitokselle = oppilaitokset
      .map((o) => o.data.oppilaitos?.metadata?.hakijapalveluidenYhteystiedot)
      .find(Boolean);
    const osalle = oppilaitokset
      .map((o) => o.data.oppilaitoksenOsa?.metadata?.hakijapalveluidenYhteystiedot)
      .find(Boolean);
    return osalle ? [osalle] : [oppilaitokselle];
  }, [oppilaitokset]);

  const filteredOrganisaatioYhteystiedot = useMemo(
    () =>
      oppilaitokset
        .filter((v) => hasYhteystiedot(v.data.oppilaitoksenOsa?.metadata))
        .flatMap((v) =>
          v.data.oppilaitoksenOsa.metadata.yhteystiedot.map((y: typeof Yhteystiedot) =>
            Object.assign({ oid: v.data.oppilaitoksenOsa.organisaatio?.oid }, y)
          )
        ),
    [oppilaitokset]
  );
  return (
    <>
      {filtered?.length > 0 && (
        <Box
          mt={8}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center">
          {filtered.map((oppilaitos: any) => (
            <React.Fragment key={oppilaitos.oid}>
              <Typography variant="h2">
                {t('oppilaitos.tietoa-oppilaitoksesta')}
              </Typography>
              <Spacer />
              {oppilaitos.metadata.esittely && (
                <Grid
                  item
                  container
                  sm={12}
                  md={6}
                  direction="column"
                  alignItems="center">
                  {oppilaitos.logo && (
                    <OppilaitosKorttiLogo
                      alt={t('oppilaitos.oppilaitoksen-logo')}
                      image={oppilaitos.logo}
                    />
                  )}
                  <LocalizedHTML data={oppilaitos.metadata.esittely} noMargin />
                </Grid>
              )}

              {oppilaitos.metadata.wwwSivu && (
                <Button
                  style={{
                    marginTop: 20,
                    fontWeight: 600,
                  }}
                  target="_blank"
                  href={localize(oppilaitos.metadata.wwwSivu.url)}
                  variant="contained"
                  size="medium"
                  color="primary">
                  {isEmpty(oppilaitos.metadata.wwwSivu.nimi)
                    ? t('oppilaitos.oppilaitoksen-www-sivut')
                    : localize(oppilaitos.metadata.wwwSivu)}
                  <OpenInNewIcon fontSize="small" />
                </Button>
              )}
              <Yhteystiedot
                id={localize(oppilaitos)}
                tarjoajat={tarjoajat}
                {...oppilaitos.metadata}
                hakijapalveluidenYhteystiedot={kaytettavatHakijapalveluidenYhteystiedot} //Huom. tämä päätelty kenttä yliajaa oppilaitoken metadatassa mahdollisesti olevat yhteystiedot.
                organisaatioidenYhteystiedot={filteredOrganisaatioYhteystiedot}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
};
