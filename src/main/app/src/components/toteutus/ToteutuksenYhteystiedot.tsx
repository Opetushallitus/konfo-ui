import React, { useMemo } from 'react';

import { Box, Button, Grid, Typography } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { OppilaitosKorttiLogo } from '#/src/components/common/KorttiLogo';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import Spacer from '#/src/components/common/Spacer';
import { useOppilaitokset } from '#/src/components/oppilaitos/hooks';
import { hasYhteystiedot, Yhteystiedot } from '#/src/components/oppilaitos/Yhteystiedot';
import { localize } from '#/src/tools/localization';

// NOTE: In most cases there is only one oppilaitos per KOMOTO but there is no limit in data model
export const ToteutuksenYhteystiedot = ({ oids }: { oids: Array<string> }) => {
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
            !_.isEmpty(v.data.metadata?.wwwSivu) ||
            !_.isEmpty(v.data.metadata?.esittely) ||
            hasYhteystiedot(v.data.metadata)
        )
        .map((v) => v.data),
    [oppilaitokset]
  );

  const filteredOrganisaatioYhteystiedot = useMemo(
    () =>
      oppilaitokset
        .filter((v) => hasYhteystiedot(v.data.oppilaitoksenOsa?.metadata))
        .flatMap((v) => v.data.oppilaitoksenOsa.metadata.yhteystiedot),
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
                  {_.isEmpty(oppilaitos.metadata.wwwSivu.nimi)
                    ? t('oppilaitos.oppilaitoksen-www-sivut')
                    : localize(oppilaitos.metadata.wwwSivu)}
                  <OpenInNewIcon fontSize="small" />
                </Button>
              )}
              <Yhteystiedot
                id={localize(oppilaitos)}
                {...oppilaitos.metadata}
                organisaatioidenYhteystiedot={filteredOrganisaatioYhteystiedot}
              />
            </React.Fragment>
          ))}
        </Box>
      )}
    </>
  );
};
