import React, { useEffect, useMemo } from 'react';

import { Alert, Backdrop, Box, Button, Link, Paper, Typography } from '@mui/material';
import { isEmpty, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikit } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import {
  SuosikitState,
  useNonRemovedSuosikitCount,
  useSuosikitSelection,
  useVertailuSuosikit,
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
import { OutlinedCheckboxButton } from './OutlinedCheckboxButton';

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

const ToggleVertailuButton = ({ oid }: { oid: string }) => {
  const { toggleVertailu } = useSuosikitSelection();
  const vertailuSuosikit = useVertailuSuosikit();

  const checked = vertailuSuosikit.indexOf(oid) !== -1;

  return (
    <OutlinedCheckboxButton
      checked={checked}
      onClick={() => {
        toggleVertailu(oid);
      }}>
      {checked ? 'Poista vertailusta' : 'Lisää vertailuun'}
    </OutlinedCheckboxButton>
  );
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
    <PaperWithAccent key={hakukohdeSuosikki.hakukohdeOid} role="listitem">
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
      <Link href={`toteutus/${hakukohdeSuosikki.toteutusOid}`}>
        <Heading color="primary" variant="h4">
          {localize(hakukohdeSuosikki.nimi)}
        </Heading>
      </Link>
      <Typography>{kuvaus}</Typography>
      <p>{hakukohdeSuosikki.timestamp}</p>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        flexWrap="wrap"
        mt={2}
        gap={2}>
        <Box
          display="flex"
          columnGap={3}
          alignItems="flex-end"
          justifyContent="space-between"
          flexWrap="wrap-reverse"
          flex-direction="column">
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
        <Box ml="auto">
          <ToggleVertailuButton oid={hakukohdeSuosikki.hakukohdeOid} />
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

const VertaileButton = () => {
  const vertailuSuosikit = useVertailuSuosikit();
  return (
    <Button
      sx={{ alignSelf: 'flex-end' }}
      href="suosikit/vertailu"
      disabled={vertailuSuosikit.length === 0}
      variant="outlined"
      color="primary">
      Vertaile valittuja ({vertailuSuosikit.length})
    </Button>
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
          {!isFetching && !isEmpty(data) && <VertaileButton />}
          <Box
            role="list"
            data-testid="suosikit-list"
            display="flex"
            flexDirection="column"
            rowGap={3}>
            {orderedData?.map((hakukohdeSuosikki) => (
              <SuosikkiKortti
                key={hakukohdeSuosikki.hakukohdeOid}
                hakukohdeSuosikki={hakukohdeSuosikki}
                removed={suosikitSelection?.[hakukohdeSuosikki.hakukohdeOid]?.removed}
              />
            ))}
          </Box>
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
    return () => clearSoftRemovedSuosikit();
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
