import { Alert, Box, Button, Collapse, Link, Tooltip, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';
import { TransitionGroup } from 'react-transition-group';
import { usePrevious } from 'react-use';

import { getHakukohdeSuosikit } from '#/src/api/konfoApi';
import {
  SuosikitState,
  useSuosikitCount,
  useSuosikitDataOrdered,
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Koodi, Suosikki, Translateable } from '#/src/types/common';

import { ContentWrapper } from './common/ContentWrapper';
import { OppilaitosKorttiLogo } from './common/KorttiLogo';
import { MaterialIcon } from './common/MaterialIcon';
import { Murupolku } from './common/Murupolku';
import { QueryResult } from './common/QueryResultWrapper';
import { TextWithBackground } from './common/TextWithBackground';
import { ToggleSuosikkiButton } from './common/ToggleSuosikkiButton';
import { Heading, HeadingBoundary } from './Heading';
import { OutlinedCheckboxButton } from './OutlinedCheckboxButton';
import { PaperWithTopColor } from './PaperWithTopColor';
import { SiirryHakulomakkeelleButton } from './SuosikitVertailuPage/SiirryHakulomakkeelleButton';
import {
  SiirryHakulomakkeelleDialog,
  useDialogState,
} from './SuosikitVertailuPage/SiirryHakulomakkeelleDialog';
import { ToggleVieHakulomakkeelleButton } from './SuosikitVertailuPage/ToggleVieHakulomakkeelleButton';

const useSuosikitData = (oids?: Array<string>) => {
  const queryClient = useQueryClient();
  const previousOids = usePrevious(oids);

  const oidsRemoved =
    oids &&
    previousOids &&
    oids?.length < previousOids?.length &&
    oids?.every((v) => previousOids?.includes(v));

  // Jos poistetaan suosikki, asetetaan uudelle pyynnölle arvo filtteröimällä.
  // Näin ei noudeta dataa turhaan ja näytetä spinneriä -> pystytään animoimaan poistaminen.
  if (oidsRemoved) {
    const previousData: Array<Suosikki> | undefined = queryClient.getQueryData([
      'getSuosikit',
      previousOids,
    ]);
    queryClient.setQueryData(
      ['getSuosikit', oids],
      previousData?.filter(({ hakukohdeOid }) => oids?.includes(hakukohdeOid))
    );
  }

  return useQuery(
    ['getSuosikit', oids],
    () => getHakukohdeSuosikit({ 'hakukohde-oids': oids! }),
    {
      enabled: !isEmpty(oids),
      refetchOnWindowFocus: false,
    }
  );
};

const Tutkintonimikkeet = ({
  tutkintonimikkeet,
}: {
  tutkintonimikkeet?: Array<Koodi>;
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

const MAX_VERTAILTAVAT = 3;

const ToggleVertailuButton = ({ oid }: { oid: string }) => {
  const { t } = useTranslation();
  const { toggleVertailu } = useSuosikitSelection();
  const vertailuSuosikit = useVertailuSuosikit();

  const tooltipText =
    vertailuSuosikit.length >= MAX_VERTAILTAVAT
      ? t('suosikit.vertailuun-voi-lisata-enintaan', { max: MAX_VERTAILTAVAT })
      : undefined;

  const isChecked = vertailuSuosikit.includes(oid);

  return (
    <Tooltip title={!isChecked && tooltipText} placement="top" arrow>
      <span>
        <OutlinedCheckboxButton
          checked={isChecked}
          disabled={!isChecked && Boolean(tooltipText)}
          onClick={() => {
            toggleVertailu(oid);
          }}>
          {isChecked ? t('suosikit.poista-vertailusta') : t('suosikit.lisaa-vertailuun')}
        </OutlinedCheckboxButton>
      </span>
    </Tooltip>
  );
};

const SuosikkiKortti = ({
  hakukohdeSuosikki,
  data,
}: {
  hakukohdeSuosikki: Suosikki;
  data?: Array<Suosikki>;
}) => {
  const { t } = useTranslation();

  const logoAltText = `${t('haku.oppilaitoksen-logo')}`;

  const kuvaus = useTruncatedKuvaus(localize(hakukohdeSuosikki.esittely));

  return (
    <PaperWithTopColor key={hakukohdeSuosikki.hakukohdeOid} role="listitem">
      <Box
        sx={{
          display: 'inline-block',
          position: 'relative',
          float: 'right',
        }}>
        <OppilaitosKorttiLogo image={hakukohdeSuosikki.logo} alt={logoAltText} />
      </Box>
      <Heading color="primary" variant="h4">
        <Typography variant="body1">
          {localize(hakukohdeSuosikki.oppilaitosNimi)}
        </Typography>
        <Link href={`toteutus/${hakukohdeSuosikki.toteutusOid}`}>
          {localize(hakukohdeSuosikki.nimi)}
        </Link>
      </Heading>
      <Typography>{kuvaus}</Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-end"
        flexWrap="wrap"
        marginTop={2}
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
              {localize(hakukohdeSuosikki.jarjestyspaikka?.paikkakunta)}
            </Typography>
          </Box>
          <Box marginTop="3px" marginBottom={1}>
            {hakukohdeSuosikki.hakuAuki && (
              <TextWithBackground>{t('haku.hakukaynnissa')}</TextWithBackground>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          marginLeft="auto"
          gap={1}
          flexWrap="wrap"
          justifyContent="flex-end">
          <ToggleVertailuButton oid={hakukohdeSuosikki.hakukohdeOid} />
          <ToggleVieHakulomakkeelleButton suosikki={hakukohdeSuosikki} data={data} />
          <ToggleSuosikkiButton
            hakukohdeOid={hakukohdeSuosikki.hakukohdeOid}
            confirmRemove
          />
        </Box>
      </Box>
    </PaperWithTopColor>
  );
};

const MissingSuosikit = ({ removeMissing }: { removeMissing: () => void }) => {
  const { t } = useTranslation();

  return (
    <Alert
      severity="warning"
      sx={{
        '& .MuiAlert-message': {
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          flexWrap: 'wrap',
          gap: 1,
        },
      }}>
      <Box flexShrink="1" display="inline-block">
        {t('suosikit.puuttuvia-suosikkeja')}
      </Box>
      <Button
        color="primary"
        variant="contained"
        onClick={removeMissing}
        sx={{ justifySelf: 'flex-end', marginLeft: 'auto' }}>
        {t('suosikit.poista-puuttuvat')}
      </Button>
    </Alert>
  );
};

const VertaileValittuja = () => {
  const { t } = useTranslation();
  const vertailuSuosikit = useVertailuSuosikit();
  const isDisabled = vertailuSuosikit.length === 0;
  return (
    <Tooltip
      placement="top"
      title={isDisabled ? t('suosikit.vertaile-ohje') : null}
      arrow>
      <span>
        <Button
          variant="contained"
          href="suosikit/vertailu"
          disabled={isDisabled}
          color="primary">
          {t('suosikit.vertaile-valittuja')}
          {` (${vertailuSuosikit.length})`}
        </Button>
      </span>
    </Tooltip>
  );
};

const TransitionGroupList = styled(TransitionGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing(3),
}));

const SuosikitList = ({
  suosikitSelection,
  removeSuosikit,
}: {
  suosikitSelection: SuosikitState['suosikitSelection'];
  removeSuosikit: SuosikitState['removeSuosikit'];
}) => {
  const queryResult = useSuosikitData(Object.keys(suosikitSelection));
  const { data, isFetching } = queryResult;

  const orderedData = useSuosikitDataOrdered(data);

  const suosikitWithMissingData = Object.keys(suosikitSelection).filter(
    (oid) => !data?.find((item) => item.hakukohdeOid == oid)
  );

  const { isOpen, setIsOpen } = useDialogState();

  return (
    <QueryResult queryResult={queryResult}>
      <SiirryHakulomakkeelleDialog
        data={data}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <HeadingBoundary>
        <Box display="flex" flexDirection="column" rowGap={3}>
          {!isFetching && !isEmpty(suosikitWithMissingData) && (
            <MissingSuosikit
              removeMissing={() => removeSuosikit(suosikitWithMissingData)}
            />
          )}
          {!isFetching && !isEmpty(data) && (
            <Box display="flex" gap={2} justifyContent="flex-end" flexWrap="wrap">
              <VertaileValittuja />
              <SiirryHakulomakkeelleButton data={data} />
            </Box>
          )}
          <TransitionGroupList role="list" data-testid="suosikit-list">
            {orderedData?.map((hakukohdeSuosikki) => (
              <Collapse key={hakukohdeSuosikki.hakukohdeOid}>
                <SuosikkiKortti hakukohdeSuosikki={hakukohdeSuosikki} data={data} />
              </Collapse>
            ))}
          </TransitionGroupList>
        </Box>
      </HeadingBoundary>
    </QueryResult>
  );
};

export const SuosikitPage = () => {
  const { t } = useTranslation();
  const { suosikitSelection, removeSuosikit } = useSuosikitSelection();

  const suosikitCount = useSuosikitCount();

  return (
    <ContentWrapper>
      <Box width="100%" alignSelf="start">
        <Murupolku path={[{ name: t('suosikit.otsikko') }]} />
      </Box>
      <Heading variant="h1">{t('suosikit.otsikko')}</Heading>
      <Box display="inline-flex" marginBottom={1}>
        {suosikitCount > 0 ? (
          <>
            <Box marginRight={1}>
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
