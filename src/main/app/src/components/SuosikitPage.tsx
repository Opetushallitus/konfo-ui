import { useEffect, useMemo } from 'react';

import { Alert, Backdrop, Box, Button, Paper, Typography } from '@mui/material';
import { isEmpty, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikit } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import {
  SuosikitState,
  useNonRemovedSuosikitCount,
  useSuosikitSelection,
} from '#/src/hooks/useSuosikitSelection';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { ContentWrapper } from './common/ContentWrapper';
import { OppilaitosKorttiLogo } from './common/KorttiLogo';
import { MaterialIcon } from './common/MaterialIcon';
import { Murupolku } from './common/Murupolku';
import { QueryResultWrapper } from './common/QueryResultWrapper';
import { TextWithBackground } from './common/TextWithBackground';
import { ToggleSuosikkiButton } from './common/ToggleSuosikkiButton';
import { Heading, HeadingBoundary } from './Heading';

const useSuosikitData = (oids?: Array<string>) =>
  useQuery(
    ['getSuosikit', oids],
    () => getHakukohdeSuosikit({ 'hakukohde-oids': oids! }),
    {
      enabled: !isEmpty(oids),
    }
  );

const PaperWithAccent = styled(Paper)(({ theme }) => ({
  borderTop: `5px solid ${colors.brandGreen}`,
  width: '100%',
  position: 'relative',
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

const SuosikkiKortti = ({
  hakukohdeSuosikki,
  removed,
}: {
  hakukohdeSuosikki: any;
  removed?: boolean;
}) => {
  const { t } = useTranslation();

  const logoAltText = `${t('haku.oppilaitoksen-logo')}`;

  const kuvaus = useTruncatedKuvaus(localize(hakukohdeSuosikki.esittely));

  return (
    <PaperWithAccent key={hakukohdeSuosikki.hakukohdeOid}>
      <Backdrop sx={{ position: 'absolute' }} open={Boolean(removed)} />
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
      <p>{hakukohdeSuosikki.timestamp}</p>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mt={2}
        columnGap={2}>
        <Box display="flex" columnGap={3} alignItems="flex-end" flexWrap="wrap-reverse">
          <Box display="flex">
            <Tutkintonimikkeet tutkintonimikkeet={hakukohdeSuosikki.tutkintonimikkeet} />
          </Box>
          <Box display="flex">
            <MaterialIcon icon="public" />
            <Typography display="flex" marginLeft={1}>
              {localize(hakukohdeSuosikki.jarjestyspaikka.paikkakunta)}
            </Typography>
          </Box>
          <Box mt="3px" mb={1}>
            <TextWithBackground>{t('haku.hakukaynnissa')}</TextWithBackground>
          </Box>
        </Box>
        <Box>
          <ToggleSuosikkiButton
            hakukohdeOid={hakukohdeSuosikki.hakukohdeOid}
            softRemove
          />
        </Box>
      </Box>
    </PaperWithAccent>
  );
};

const MissingSuosikit = ({ removeMissing }: { removeMissing: () => void }) => {
  const { t } = useTranslation();

  return (
    <Alert
      severity="warning"
      sx={{
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center',
      }}>
      <Box display="inline-block" mr={2}>
        {t('suosikit.puuttuvia-suosikkeja')}
      </Box>
      <Button color="primary" variant="contained" onClick={removeMissing}>
        {t('suosikit.poista-puuttuvat')}
      </Button>
    </Alert>
  );
};

const SuosikitList = ({
  suosikitSelection,
  removeSuosikit,
}: {
  suosikitSelection: SuosikitState['suosikitSelection'];
  removeSuosikit: SuosikitState['removeSuosikit'];
}) => {
  const queryResult = useSuosikitData(Object.keys(suosikitSelection));
  const { data, isFetching } = queryResult;

  const orderedData = useMemo(
    () =>
      sortBy(
        data,
        (suosikkiData) => suosikitSelection[suosikkiData.hakukohdeOid]?.timestamp
      ),
    [data, suosikitSelection]
  );

  const suosikitWithMissingData = Object.keys(suosikitSelection).filter(
    (oid) => !data?.find((item) => item.hakukohdeOid == oid)
  );

  return (
    <QueryResultWrapper queryResult={queryResult}>
      <HeadingBoundary>
        <Box display="flex" flexDirection="column" rowGap={3}>
          {!isFetching && !isEmpty(suosikitWithMissingData) && (
            <MissingSuosikit
              removeMissing={() => removeSuosikit(suosikitWithMissingData)}
            />
          )}
          {orderedData?.map((hakukohdeSuosikki) => (
            <SuosikkiKortti
              key={hakukohdeSuosikki.hakukohdeOid}
              hakukohdeSuosikki={hakukohdeSuosikki}
              removed={suosikitSelection?.[hakukohdeSuosikki.hakukohdeOid]?.removed}
            />
          ))}
        </Box>
      </HeadingBoundary>
    </QueryResultWrapper>
  );
};

export const SuosikitPage = () => {
  const { t } = useTranslation();
  const { suosikitSelection, clearSoftRemovedSuosikit, removeSuosikit } =
    useSuosikitSelection();

  const suosikitCount = useNonRemovedSuosikitCount();

  useEffect(() => {
    clearSoftRemovedSuosikit();
  }, [clearSoftRemovedSuosikit]);

  return (
    <ContentWrapper>
      <Box width="100%" alignSelf="start">
        <Murupolku path={[{ name: t('suosikit.otsikko') }]} />
      </Box>
      <Heading variant="h1">{t('suosikit.otsikko')}</Heading>
      <Box display="inline-flex" mb={1}>
        {suosikitCount > 0 ? (
          <>
            <Box mr={1}>
              <MaterialIcon icon="favorite" color="primary" />
            </Box>
            {t('suosikit.tallennettu-hakukohde', { count: suosikitCount })}
          </>
        ) : (
          t('suosikit.ei-tallennettuja-hakukohteita')
        )}
      </Box>
      {!isEmpty(suosikitSelection) && (
        <SuosikitList
          suosikitSelection={suosikitSelection}
          removeSuosikit={removeSuosikit}
        />
      )}
    </ContentWrapper>
  );
};
