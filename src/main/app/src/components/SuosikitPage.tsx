import { Box, Paper, Typography } from '@mui/material';
import { isEmpty, truncate } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikit } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { useHakukohdeFavourites } from '#/src/hooks/useHakukohdeFavourites';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { ContentWrapper } from './common/ContentWrapper';
import { OppilaitosKorttiLogo } from './common/KorttiLogo';
import { MaterialIcon } from './common/MaterialIcon';
import { QueryResultWrapper } from './common/QueryResultWrapper';
import { TextWithBackground } from './common/TextWithBackground';
import { Heading, HeadingBoundary } from './Heading';
import { ToggleFavouriteButton } from './toteutus/ToteutusHakukohteet';

const useTruncatedKuvaus = (kuvaus: string) => {
  const { t } = useTranslation();
  return kuvaus
    ? truncate(localize(kuvaus).replace(/<[^>]*>/gm, ' '), {
        length: 300,
      })
    : t('haku.ei_kuvausta');
};

const useHakukohdeSuosikitData = (oids?: Array<string>) => {
  return useQuery(
    ['getHakukohdeSuosikit', oids],
    () => getHakukohdeSuosikit({ 'hakukohde-oids': oids! }),
    {
      enabled: !isEmpty(oids),
    }
  );
};

const PaperWithAccent = styled(Paper)(({ theme }) => ({
  borderTop: `5px solid ${colors.brandGreen}`,
  width: '100%',
  padding: `${theme.spacing(3)}`,
}));

const Tutkintonimikkeet = ({
  tutkintonimikkeet,
}: {
  tutkintonimikkeet: Array<{ nimi: Translateable }>;
}) => {
  return tutkintonimikkeet ? (
    <>
      <MaterialIcon icon="school" variant="outlined" />
      <Typography display="flex" marginLeft={1} sx={{ whiteSpace: 'pre' }}>
        {tutkintonimikkeet.map((tn: { nimi: Translateable }) => localize(tn)).join('\n')}
      </Typography>
    </>
  ) : null;
};

const SuosikkiKortti = ({ hakukohdeSuosikki }: { hakukohdeSuosikki: any }) => {
  const { t } = useTranslation();

  const logoAltText = `${t('haku.oppilaitoksen-logo')}`;

  const kuvaus = useTruncatedKuvaus(hakukohdeSuosikki.esittely);

  return (
    <PaperWithAccent key={hakukohdeSuosikki.hakukohdeOid}>
      <Box
        sx={{
          display: 'inline-block',
          position: 'relative',
          float: 'right',
        }}>
        <OppilaitosKorttiLogo image={hakukohdeSuosikki.logo} alt={logoAltText} />
      </Box>
      <Typography variant="body1">
        {localize(hakukohdeSuosikki.jarjestyspaikka)}
      </Typography>
      <Heading variant="h4">{localize(hakukohdeSuosikki.nimi)}</Heading>
      <Typography>{kuvaus}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mt={2}
        columnGap={3}>
        <Box display="flex" columnGap={3} alignItems="flex-start">
          <Box display="flex">
            <Tutkintonimikkeet tutkintonimikkeet={hakukohdeSuosikki.tutkintonimikkeet} />
          </Box>
          <Box display="flex">
            <MaterialIcon icon="public" />
            <Typography display="flex" marginLeft={1}>
              {localize(hakukohdeSuosikki.jarjestyspaikka.paikkakunta)}
            </Typography>
          </Box>
          <Box>
            <TextWithBackground>{t('haku.hakukaynnissa')}</TextWithBackground>
          </Box>
        </Box>
        <Box sx={{ float: 'right' }}>
          <ToggleFavouriteButton hakukohdeOid={hakukohdeSuosikki.hakukohdeOid} />
        </Box>
      </Box>
    </PaperWithAccent>
  );
};

export const SuosikitPage = () => {
  const { t } = useTranslation();
  const { hakukohdeFavourites } = useHakukohdeFavourites();

  const queryResult = useHakukohdeSuosikitData(Object.keys(hakukohdeFavourites));
  const { data } = queryResult;

  return (
    <ContentWrapper>
      <Heading variant="h1">{t('suosikit.otsikko')}</Heading>
      {isEmpty(hakukohdeFavourites) ? (
        t('suosikit.ei-suosikkeja')
      ) : (
        <QueryResultWrapper queryResult={queryResult}>
          <HeadingBoundary>
            <Box display="flex" flexDirection="column" rowGap={3}>
              {data?.map((hakukohdeSuosikki) => (
                <SuosikkiKortti
                  key={hakukohdeSuosikki.hakukohdeOid}
                  hakukohdeSuosikki={hakukohdeSuosikki}
                />
              ))}
            </Box>
          </HeadingBoundary>
        </QueryResultWrapper>
      )}
    </ContentWrapper>
  );
};
