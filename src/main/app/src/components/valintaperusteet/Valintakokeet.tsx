import React from 'react';

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Accordion } from '#/src/components/common/Accordion';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { localize, localizeOsoite } from '#/src/tools/localization';
import { formatDateString, toId } from '#/src/tools/utils';
import { Koodi, Translateable } from '#/src/types/common';

const useStyles = makeStyles(() => ({
  valintakoeHeader: {
    fontSize: '20px',
    color: colors.darkGrey,
  },
  valintakoeSubHeader: {
    fontWeight: 700,
    color: colors.darkGrey,
  },
}));

type TilaisuusProps = {
  index: number;
  tilaisuus: Tilaisuus;
};

const TilaisuusComponent = ({
  index,
  tilaisuus: {
    lisatietoja,
    jarjestamispaikka,
    osoite: { osoite, postinumero },
    aika: { alkaa, paattyy },
  },
}: TilaisuusProps) => {
  const { t } = useTranslation();
  return (
    <Grid style={{ padding: '10px 20px' }} container key={`koetilaisuus-${index}`}>
      <HeadingBoundary>
        <Grid item xs={6}>
          <Box py={1}>
            <Heading variant="h5">{t('valintaperuste.alkaa')}</Heading>
            <Typography variant="body1">{formatDateString(alkaa)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box py={1}>
            <Heading variant="h5">{t('valintaperuste.paattyy')}</Heading>
            <Typography variant="body1">{formatDateString(paattyy)}</Typography>
          </Box>
        </Grid>
        {postinumero ? (
          <Grid item xs={12}>
            <Box py={1}>
              <Heading variant="h5">{t('valintaperuste.jarjestyspaikka')}</Heading>
              <Typography variant="body1">{localize(jarjestamispaikka)}</Typography>
              <Typography variant="body1">
                {localizeOsoite(osoite, postinumero)}
              </Typography>
            </Box>
          </Grid>
        ) : null}
        {!_.isEmpty(lisatietoja) && (
          <Grid item xs={12}>
            <Box py={1}>
              <Heading variant="h5">{t('valintaperuste.lisatietoja')}</Heading>
              <LocalizedHTML data={lisatietoja!} defaultValue="-" />
            </Box>
          </Grid>
        )}
      </HeadingBoundary>
    </Grid>
  );
};

type Tilaisuus = {
  lisatietoja: Translateable;
  jarjestamispaikka: Translateable;
  osoite: { osoite: Translateable; postinumero: Koodi };
  aika: { alkaa: string; paattyy: string };
};

type Props = {
  valintakokeet: Array<{
    nimi: string;
    tyyppi: Koodi;
    tilaisuudet: Array<Tilaisuus>;
    metadata: {
      ohjeetErityisjarjestelyihin: Translateable;
      ohjeetEnnakkovalmistautumiseen: Translateable;
      tietoja: Translateable;
      vahimmaispisteet?: number;
    };
  }>;
  yleiskuvaukset: {
    valintaperuste: Translateable;
    hakukohde: Translateable;
  };
};

export const Valintakokeet = ({
  yleiskuvaukset: {
    valintaperuste: valintaperusteYk,
    hakukohde: hakukohdeYk,
  } = {} as Props['yleiskuvaukset'],
  valintakokeet = [],
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item container direction="column" xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <HeadingBoundary>
        <Heading variant="h2" id={toId(t('valintaperuste.valintakokeet'))}>
          {t('valintaperuste.valintakokeet')}
        </Heading>
        <HeadingBoundary>
          {!_.isEmpty(valintaperusteYk) && (
            <Box py={1}>
              <Heading variant="h3">
                {t('valintaperuste.valintakokeet-yleiskuvaus-valintaperuste')}
              </Heading>
              <LocalizedHTML data={valintaperusteYk} />
            </Box>
          )}
          {!_.isEmpty(hakukohdeYk) && (
            <Box py={1}>
              <Heading variant="h3">
                {t('valintaperuste.valintakokeet-yleiskuvaus-hakukohde')}
              </Heading>
              <LocalizedHTML data={hakukohdeYk} />
            </Box>
          )}
          {valintakokeet.map(({ nimi, tyyppi, tilaisuudet, metadata = {} }, index) => {
            const localizedTyyppi = localize(tyyppi?.nimi);
            const {
              ohjeetErityisjarjestelyihin,
              ohjeetEnnakkovalmistautumiseen,
              tietoja,
              vahimmaispisteet,
            } = metadata;

            return (
              <div key={`valintakoe-${index}`}>
                <Card
                  id={`${toId(localize(nimi))}`}
                  elevation={0}
                  style={{
                    backgroundColor: colors.grey,
                    padding: '15px',
                    marginBottom: '20px',
                  }}>
                  <CardContent>
                    <Heading variant="body1">
                      {localizedTyyppi}
                      <hr style={{ borderStyle: 'none', margin: 0 }} />
                      <Box style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        {localize(nimi)}
                      </Box>
                    </Heading>
                    {!_.isEmpty(tietoja) && <LocalizedHTML data={tietoja!} />}
                    <HeadingBoundary>
                      {vahimmaispisteet && (
                        <>
                          <Heading variant="h5" className={classes.valintakoeSubHeader}>
                            {t('valintaperuste.alin-hyvaksytty-pistemaara')}
                          </Heading>
                          <Typography variant="body1">{vahimmaispisteet}</Typography>
                        </>
                      )}
                      {!_.isEmpty(ohjeetEnnakkovalmistautumiseen) && (
                        <>
                          <Heading variant="h5" className={classes.valintakoeSubHeader}>
                            {t('valintaperuste.valmistautumisohjeet-hakijalle')}
                          </Heading>
                          <LocalizedHTML data={ohjeetEnnakkovalmistautumiseen!} />
                        </>
                      )}
                      {!_.isEmpty(ohjeetErityisjarjestelyihin) && (
                        <>
                          <Heading variant="h5" className={classes.valintakoeSubHeader}>
                            {t('valintaperuste.ohjeet-erityisjarjestelyihin')}
                          </Heading>
                          <LocalizedHTML data={ohjeetErityisjarjestelyihin!} />
                        </>
                      )}
                      {tilaisuudet.length > 0 && (
                        <Box mt={2}>
                          <Accordion
                            noColors
                            ContentWrapper={'div' as any}
                            items={tilaisuudet.map((tilaisuus, index) => ({
                              title: `${t('valintaperuste.tilaisuus')} ${index + 1}`,
                              content: (
                                <TilaisuusComponent index={index} tilaisuus={tilaisuus} />
                              ),
                            }))}
                          />
                        </Box>
                      )}
                    </HeadingBoundary>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </HeadingBoundary>
      </HeadingBoundary>
    </Grid>
  );
};
