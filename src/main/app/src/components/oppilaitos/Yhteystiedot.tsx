import React, { useMemo } from 'react';

import { Box, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isEmpty, hasIn } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { OskariKartta } from '#/src/components/common/OskariKartta';
import Spacer from '#/src/components/common/Spacer';
import { localize } from '#/src/tools/localization';
import { byLocaleCompare, toId } from '#/src/tools/utils';
import { Yhteystiedot as YhteystiedotType } from '#/src/types/common';
import { Organisaatio } from '#/src/types/ToteutusTypes';

const PREFIX = 'Yhteystiedot';

const classes = {
  container: `${PREFIX}-container`,
  info: `${PREFIX}-info`,
  text: `${PREFIX}-text`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.container}`]: {
    marginTop: 10,
  },

  [`& .${classes.info}`]: {
    width: 230,
  },

  [`& .${classes.text}`]: {
    color: colors.black,
    fontWeight: 600,
  },
}));

const parseYhteystieto =
  () =>
  ({
    nimi,
    kayntiosoite: kayntiosoiteProp,
    postiosoiteStr,
    kayntiosoiteStr,
    sahkoposti,
    puhelinnumero,
  }: YhteystiedotType) => {
    return {
      nimi: localize(nimi),
      postiosoite: localize(postiosoiteStr),
      kayntiosoite: localize(kayntiosoiteStr),
      sahkoposti: localize(sahkoposti),
      puhelinnumero: localize(puhelinnumero),
      oskariOsoite: localize(kayntiosoiteProp?.osoite),
      oskariPostitoimipaikka: localize(kayntiosoiteProp?.postinumero),
    };
  };

const YhteystietoRow = ({ title, text }: { title: string; text: string }) => (
  <Grid container spacing={1} alignItems="flex-start">
    <Grid item sm={4}>
      <Typography variant="body1" noWrap>
        {title}
      </Typography>
    </Grid>
    <Grid item sm={8}>
      <Typography variant="body1">{text}</Typography>
    </Grid>
  </Grid>
);

type Props = {
  id: string;
  heading?: string;
  tarjoajat?: Array<Organisaatio>;
  yhteystiedot?: Array<YhteystiedotType>;
  hakijapalveluidenYhteystiedot?: YhteystiedotType;
  organisaatioidenYhteystiedot?: Array<YhteystiedotType>;
  matchTarjoajat?: boolean;
};

export const hasYhteystiedot = (props: Props = {} as any) =>
  (props.yhteystiedot && props.yhteystiedot?.length > 0) ||
  !isEmpty(props.hakijapalveluidenYhteystiedot);

export const Yhteystiedot = ({
  id,
  heading,
  yhteystiedot,
  tarjoajat,
  hakijapalveluidenYhteystiedot,
  organisaatioidenYhteystiedot,
  matchTarjoajat = true,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const localizedYhteystiedot = useMemo(() => {
    const organisaatiot = (yhteystiedot || [])
      .concat(organisaatioidenYhteystiedot as any)
      .filter((obj) => hasIn(obj, 'nimi'))
      .filter(
        (obj) =>
          !matchTarjoajat ||
          tarjoajat?.some((ta) => obj?.nimi?.fi === ta?.nimi?.fi || obj?.oid === ta?.oid)
      )
      .filter(Boolean)
      .map(parseYhteystieto())
      .sort(byLocaleCompare('nimi'));

    if (Array.isArray(hakijapalveluidenYhteystiedot)) {
      return hakijapalveluidenYhteystiedot
        .filter(Boolean)
        .map(parseYhteystieto())
        .sort(byLocaleCompare('nimi'))
        .concat(organisaatiot);
    }

    return [hakijapalveluidenYhteystiedot as any] // hakijapalveluidenYhteystiedot aina ensimmäisenä, vasta sen jälkeen sortataan
      .filter((obj) => hasIn(obj, 'nimi'))
      .map(parseYhteystieto())
      .filter(Boolean)
      .concat(organisaatiot);
  }, [
    hakijapalveluidenYhteystiedot,
    organisaatioidenYhteystiedot,
    yhteystiedot,
    tarjoajat,
    matchTarjoajat,
  ]);

  return (
    <StyledBox
      mt={isSm ? 6 : 12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%">
      {heading && (
        <>
          <Typography variant="h2">{heading}</Typography>
          <Spacer />
        </>
      )}
      {localizedYhteystiedot.map(
        (
          {
            nimi,
            kayntiosoite,
            oskariOsoite,
            oskariPostitoimipaikka,
            postiosoite,
            puhelinnumero,
            sahkoposti,
          },
          i
        ) => (
          <Grid
            key={`${nimi}_${i}`}
            className={classes.container}
            container
            spacing={5}
            alignItems="center"
            justifyContent="center">
            <Grid item container justifyContent="center" sm={12} md={6}>
              <Paper style={{ padding: '40px', width: '100%', maxWidth: 600 }}>
                <Typography gutterBottom variant="h4">
                  {nimi || id}
                </Typography>
                {postiosoite && (
                  <YhteystietoRow
                    title={t('oppilaitos.postiosoite:')}
                    text={postiosoite}
                  />
                )}
                {kayntiosoite && (
                  <YhteystietoRow
                    title={t('oppilaitos.kayntiosoite:')}
                    text={kayntiosoite}
                  />
                )}
                {sahkoposti && (
                  <YhteystietoRow title={t('oppilaitos.sahkoposti:')} text={sahkoposti} />
                )}
                {puhelinnumero && (
                  <YhteystietoRow
                    title={t('oppilaitos.puhelinnumero:')}
                    text={puhelinnumero}
                  />
                )}
              </Paper>
            </Grid>
            {oskariOsoite && oskariPostitoimipaikka && (
              <OskariKartta
                id={toId(`${id}-${nimi}-${i}`)}
                osoite={oskariOsoite}
                postitoimipaikka={oskariPostitoimipaikka}
              />
            )}
          </Grid>
        )
      )}
    </StyledBox>
  );
};
