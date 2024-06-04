import React, { useMemo } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { isEmpty, filter, flatten, includes, map } from 'lodash';
import { useTranslation } from 'react-i18next';

import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Spacer } from '#/src/components/common/Spacer';
import { useOppilaitokset } from '#/src/components/oppilaitos/hooks';
import { Yhteystiedot } from '#/src/components/oppilaitos/Yhteystiedot';
import { localize } from '#/src/tools/localization';
import { Yhteystiedot as YhteystiedotType } from '#/src/types/common';
import { Organisaatio } from '#/src/types/ToteutusTypes';

import { ExternalLinkButton } from '../common/ExternalLinkButton';
import { hasYhteystiedot } from '../oppilaitos/hasYhteystiedot';

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
  const getKaytettavatHakijapalveluidenYhteystiedot = (oppilaitosOid: any): any => {
    const filteredOppilaitokset = oppilaitokset.filter(
      (oppilaitos) => oppilaitos.data.oid == oppilaitosOid
    );
    const filteredOppilaitoksenOsat = filter(
      flatten(filteredOppilaitokset.map((oppilaitos) => oppilaitos.data.oppilaitosOsat)),
      (osa) => includes(oids, osa.oid)
    );
    const osalle = map(
      filteredOppilaitoksenOsat,
      'oppilaitoksenOsa.metadata.hakijapalveluidenYhteystiedot'
    ).find(Boolean);
    const oppilaitokselle = filteredOppilaitokset
      .map((o) => o.data.oppilaitos?.metadata?.hakijapalveluidenYhteystiedot)
      .find(Boolean);
    return osalle ? [osalle] : [oppilaitokselle];
  };

  const getFilteredOrganisaatioYhteystiedot = (oppilaitosOid: any): any => {
    return oppilaitokset
      .filter((oppilaitos) => oppilaitos.data.oid == oppilaitosOid)
      .flatMap((oppilaitos) => oppilaitos.data.oppilaitosOsat)
      .flat()
      .filter((oppilaitoksenOsa) =>
        hasYhteystiedot(oppilaitoksenOsa.oppilaitoksenOsa?.metadata)
      )
      .flatMap((oppilaitoksenOsa) =>
        oppilaitoksenOsa.oppilaitoksenOsa.metadata.yhteystiedot.map(
          (y: typeof Yhteystiedot) =>
            Object.assign({ oid: oppilaitoksenOsa.oppilaitoksenOsa.organisaatio?.oid }, y)
        )
      );
  };

  const getOppilaitosYhteystiedot = (oppilaitos: any): Array<YhteystiedotType> => {
    const yhteystiedot = oppilaitos?.oppilaitos?.metadata?.yhteystiedot?.map(
      (yt: YhteystiedotType) => {
        return { ...yt, oid: oppilaitos?.oid };
      }
    );
    return yhteystiedot;
  };

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
                <ExternalLinkButton
                  sx={{
                    marginTop: '20px',
                    fontWeight: 600,
                  }}
                  href={localize(oppilaitos.metadata.wwwSivu.url)}>
                  {isEmpty(oppilaitos.metadata.wwwSivu.nimi)
                    ? t('oppilaitos.oppilaitoksen-www-sivut')
                    : localize(oppilaitos.metadata.wwwSivu)}
                </ExternalLinkButton>
              )}
              <Yhteystiedot
                id={localize(oppilaitos)}
                tarjoajat={tarjoajat}
                yhteystiedot={getOppilaitosYhteystiedot(oppilaitos)}
                hakijapalveluidenYhteystiedot={getKaytettavatHakijapalveluidenYhteystiedot(
                  oppilaitos.oid
                )} //Huom. tämä päätelty kenttä yliajaa oppilaitoken metadatassa mahdollisesti olevat yhteystiedot.
                organisaatioidenYhteystiedot={getFilteredOrganisaatioYhteystiedot(
                  oppilaitos.oid
                )}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
};
