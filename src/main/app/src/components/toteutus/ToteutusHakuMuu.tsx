import React, { useMemo } from 'react';

import { Button, Grid, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { AccordionText } from '#/src/components/common/AccordionText';
import { PageSection } from '#/src/components/common/PageSection';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Hakuaika } from '#/src/types/HakukohdeTypes';
import { Toteutus } from '#/src/types/ToteutusTypes';

import { HakutietoTable } from './HakutietoTable';
import { selectMuuHaku } from './hooks';
import { formatAloitus } from './utils';

const StyledPaper = styled(Paper)({
  width: '100%',
  maxWidth: '800px',
  padding: '30px',
});

type Props = { toteutus?: Toteutus };

const AlkamiskausiRivi = ({ alkamiskausi }: any) => {
  const { t } = useTranslation();

  const { alkaaText, alkaaModalText, paattyyText } = formatAloitus(alkamiskausi || {}, t);
  return (
    <HakutietoTable
      items={[
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
      ]}
    />
  );
};

const HakuaikaRivi = ({
  hakuaika,
  hakutermi,
}: {
  hakuaika: Hakuaika;
  hakutermi: string;
}) => {
  const { t } = useTranslation();
  return (
    <HakutietoTable
      items={[
        {
          size: hakuaika?.formatoituPaattyy ? 6 : 12,
          heading:
            hakutermi === 'hakeutuminen'
              ? t('toteutus.haku-alkaa:')
              : t('toteutus.ilmoittautuminen-alkaa:'),
          content: [localize(hakuaika.formatoituAlkaa)],
        },
        hakuaika?.formatoituPaattyy && {
          size: 6,
          heading:
            hakutermi === 'hakeutuminen'
              ? t('toteutus.haku-paattyy:')
              : t('toteutus.ilmoittautuminen-paattyy:'),
          content: [
            hakuaika.paattyy ? localize(hakuaika.formatoituPaattyy) : '-', // This is needed for the alkuu & paattyy to be rendered on the same row
          ],
        },
      ]}
    />
  );
};

export const ToteutusHakuMuu = ({ toteutus }: Props) => {
  const { t } = useTranslation();

  const muuHaku = useMemo(() => selectMuuHaku(toteutus), [toteutus]);

  const hakeuduTaiIlmoittauduTrans =
    muuHaku.hakutermi === 'hakeutuminen'
      ? t('toteutus.hakeudu-koulutukseen')
      : t('toteutus.ilmoittaudu-koulutukseen');

  const alkamiskausi = muuHaku?.opetus?.koulutuksenAlkamiskausi;

  return (
    <PageSection heading={hakeuduTaiIlmoittauduTrans}>
      <StyledPaper>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontWeight: 'bold',
                color: colors.grey900,
              }}>
              {localize(muuHaku.nimi)}
            </Typography>
          </Grid>
          <Grid item>
            <HakuaikaRivi hakuaika={muuHaku?.hakuaika} hakutermi={muuHaku.hakutermi} />
          </Grid>
          <Grid item>
            <AlkamiskausiRivi alkamiskausi={alkamiskausi} />
          </Grid>
          {muuHaku.aloituspaikat && (
            <Grid item container direction="row">
              <Grid item xs md={4}>
                <Typography noWrap variant="body1">
                  {t('toteutus.opiskelupaikkoja:')}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography variant="body1" fontWeight="bold" noWrap>
                  {muuHaku.aloituspaikat}
                </Typography>
              </Grid>
            </Grid>
          )}
          {muuHaku.lisatietoaHakeutumisesta && (
            <Grid item>
              <AccordionText
                title={
                  muuHaku.hakutermi === 'hakeutuminen'
                    ? t('toteutus.lisatietoa-hakeutumisesta')
                    : t('toteutus.lisatietoa-ilmoittautumisesta')
                }
                text={localize(muuHaku.lisatietoaHakeutumisesta)}
              />
            </Grid>
          )}
          {muuHaku.lisatietoaValintaperusteista && (
            <Grid item>
              <AccordionText
                title={t('toteutus.lisatietoa-valintaperusteista')}
                text={localize(muuHaku.lisatietoaValintaperusteista)}
              />
            </Grid>
          )}
          {/* TODO: insert SORA-kuvaus here when it can be fetched from backend
                <Grid item>
                <AccordionText
                title={'toteutus.hakijan-terveydentila-ja-toimintakyky'}
                text="TODO"
                />
                </Grid>
               */}
          <Grid item>
            <Button
              variant="contained"
              size="large"
              color="primary"
              target="_blank"
              href={localize(muuHaku.hakulomakeLinkki)}
              disabled={!muuHaku.isHakuAuki}>
              <Typography style={{ color: colors.white }} variant="body1">
                {hakeuduTaiIlmoittauduTrans}
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>
    </PageSection>
  );
};
