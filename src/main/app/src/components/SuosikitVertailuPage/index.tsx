import React, { useRef } from 'react';

import { Box, Divider, Link, Tooltip, Typography, useTheme } from '@mui/material';
import { includes } from 'lodash';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import { useContentWidth } from '#/src/hooks/useContentWidth';
import { useNotification } from '#/src/hooks/useNotification';
import {
  useHakuunValitut,
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import { useSyncRefHeight } from '#/src/hooks/useSyncRefHeight';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { localize } from '#/src/tools/localization';
import { isNonNil } from '#/src/tools/utils';
import { VertailuSuosikki } from '#/src/types/common';

import { useSuosikitVertailuData } from './useSuosikitVertailuData';
import { useSuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VERTAILU_FIELDS_ORDER } from './VERTAILU_FIELDS_ORDER';
import { VertailuFieldMask } from './VertailuFieldMask';
import { ContentWrapper } from '../common/ContentWrapper';
import { ExternalLinkButton } from '../common/ExternalLinkButton';
import { KorttiLogo } from '../common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from '../common/MaterialIcon';
import { Murupolku } from '../common/Murupolku';
import { QueryResult } from '../common/QueryResultWrapper';
import { TextButton } from '../common/TextButton';
import { Heading, HeadingBoundary } from '../Heading';
import { OutlinedCheckboxButton } from '../OutlinedCheckboxButton';
import { PaperWithTopColor } from '../PaperWithTopColor';

const useIsContentSmall = () => {
  const theme = useTheme();

  const contentWidth = useContentWidth();
  return contentWidth <= theme.breakpoints.values['sm'];
};

const InfoItem = ({
  fieldId,
  icon,
  iconVariant = 'filled',
  label,
  value,
}: {
  fieldId: string;
  icon: MaterialIconName;
  iconVariant?: MaterialIconVariant;
  label: string;
  value?: React.ReactNode;
}) => {
  const labelId = `${label}_${value}`;

  const itemsRef = useRef(null);

  const isContentSmall = useIsContentSmall();

  useSyncRefHeight([[fieldId, itemsRef]], { enabled: !isContentSmall });

  return isNonNil(value) ? (
    <Box display="flex" gap={1} ref={itemsRef}>
      <MaterialIcon icon={icon} variant={iconVariant} color="primary" />
      <Box display="flex" flexDirection="column">
        <Typography id={labelId}>{label}</Typography>
        <Typography
          component="div"
          display="flex"
          fontWeight="bold"
          aria-labelledby={labelId}>
          {value}
        </Typography>
      </Box>
    </Box>
  ) : null;
};

const NotificationContent = ({ data }: any) => {
  const { t } = useTranslation();

  const { url: hakulomakeURL } = useSiirryHakulomakkeelleInfo(data);

  return (
    <Box sx={{ color: 'white' }}>
      <Box fontWeight="bold">{t('suosikit-vertailu.hakukohde-valittu')}</Box>
      <Link sx={{ color: 'white', textDecorationColor: 'white' }} href={hakulomakeURL}>
        {t('suosikit-vertailu.siirry-hakulomakkelle')}
      </Link>{' '}
      <span>{t('suosikit-vertailu.tai-lisaa-muita-hakukohteita')}</span>
    </Box>
  );
};

const VieHakulomakkeelleButton = ({
  vertailuSuosikki,
  data,
}: {
  vertailuSuosikki: VertailuSuosikki;
  data?: Array<VertailuSuosikki>;
}) => {
  const { t } = useTranslation();
  const { toggleHaku } = useSuosikitSelection();
  const showNotification = useNotification((state) => state.showNotification);

  const hakuunValitut = useHakuunValitut();

  const hakuunValitutData =
    data?.filter((suosikki) => hakuunValitut?.includes(suosikki.hakukohdeOid)) ?? [];

  const allHaveSameHaku = Boolean(
    hakuunValitutData.reduce(
      (resultOid, item) => {
        return resultOid === item.hakuOid ? item.hakuOid : undefined;
      },
      vertailuSuosikki.hakuOid as string | undefined
    )
  );

  const isSelectedToHaku = includes(hakuunValitut, vertailuSuosikki.hakukohdeOid);

  const disabledReasons: Array<string> = [];

  if (!vertailuSuosikki?.hakuAuki) {
    disabledReasons.push(t('suosikit-vertailu.haku-ei-kaynnissa'));
  }
  if (!allHaveSameHaku) {
    disabledReasons.push(
      t('suosikit-vertailu.hakulomakkeella-jo-toisen-haun-hakukohteita')
    );
  }

  const isDisabled = !isSelectedToHaku || disabledReasons.length !== 0;

  return (
    <Tooltip title={disabledReasons.join('\n')} placement="top" arrow>
      <span>
        <OutlinedCheckboxButton
          disabled={isDisabled}
          checked={isSelectedToHaku}
          onClick={() => {
            toggleHaku(vertailuSuosikki.hakukohdeOid);
            if (!isSelectedToHaku) {
              showNotification({
                content: <NotificationContent data={data} />,
                severity: 'success',
              });
            }
          }}>
          {t('suosikit-vertailu.vie-hakulomakkeelle')}
        </OutlinedCheckboxButton>
      </span>
    </Tooltip>
  );
};

const VertailuKortti = ({
  vertailuSuosikki,
  data,
}: {
  vertailuSuosikki: VertailuSuosikki;
  data?: Array<VertailuSuosikki>;
}) => {
  const { t } = useTranslation();
  const { toggleVertailu } = useSuosikitSelection();

  const kuvaus = useTruncatedKuvaus(localize(vertailuSuosikki.esittely));

  const { mask } = useSuosikitVertailuMask();

  const headerRef = useRef(null);

  const { oppilaitosNimi, nimi } = vertailuSuosikki;

  const isContentSmall = useIsContentSmall();

  useSyncRefHeight([['header', headerRef]], { enabled: !isContentSmall });

  return (
    <PaperWithTopColor
      key={vertailuSuosikki.hakukohdeOid}
      role="listitem"
      sx={{ flex: '1 1 350px' }}>
      <KorttiLogo
        entity="oppilaitos"
        src={vertailuSuosikki.logo}
        alt={t('haku.oppilaitoksen-logo')}
        display="inline-block"
        position="relative"
        maxWidth="50px"
        marginRight={2}
        sx={{
          float: 'right',
        }}
      />
      <Box ref={headerRef}>
        <Typography variant="body1">{localize(oppilaitosNimi)}</Typography>
        <Link href={`toteutus/${vertailuSuosikki.toteutusOid}`}>
          <Heading variant="h4" color="primary">
            {localize(nimi)}
          </Heading>
        </Link>
        <Typography>{kuvaus}</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        flexWrap="wrap"
        marginTop={2}
        gap={2}>
        {VERTAILU_FIELDS_ORDER.map(
          ({ icon, iconVariant, getLabel, renderValue, fieldId }) => {
            return (
              mask[fieldId] && (
                <InfoItem
                  key={fieldId}
                  fieldId={fieldId}
                  icon={icon}
                  iconVariant={iconVariant}
                  label={getLabel(t, vertailuSuosikki)}
                  value={renderValue?.(vertailuSuosikki, t)}
                />
              )
            );
          }
        )}
        <Divider />
        <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={1}>
          <VieHakulomakkeelleButton data={data} vertailuSuosikki={vertailuSuosikki} />
          <TextButton onClick={() => toggleVertailu(vertailuSuosikki.hakukohdeOid)}>
            {t('suosikit.poista-vertailusta')}
          </TextButton>
        </Box>
      </Box>
    </PaperWithTopColor>
  );
};

const useSiirryHakulomakkeelleInfo = (data?: Array<VertailuSuosikki>) => {
  const hakuunValitut = useHakuunValitut();

  const hakuunValitutData =
    data?.filter((suosikki) => hakuunValitut?.includes(suosikki.hakukohdeOid)) ?? [];

  const firstValittuHakuOid = hakuunValitutData?.[0]?.hakuOid;

  const isValid = hakuunValitutData.length !== 0;

  return {
    url: isValid
      ? urls.url('ataru.hakemus-haku', firstValittuHakuOid) +
        `?hakukohteet=${hakuunValitutData.map((i) => i.hakukohdeOid).join(',')}`
      : '',
    isValid,
    count: hakuunValitutData.length,
  };
};

const SiirryHakulomakkeelleButton = ({ data }: { data?: Array<VertailuSuosikki> }) => {
  const { t } = useTranslation();

  const { url: hakulomakeURL, isValid, count } = useSiirryHakulomakkeelleInfo(data);

  return (
    <ExternalLinkButton href={hakulomakeURL} disabled={!isValid}>
      {t('suosikit-vertailu.siirry-hakulomakkeelle', {
        count,
      })}
    </ExternalLinkButton>
  );
};

const Vertailu = ({ oids }: { oids: Array<string> }) => {
  const queryResult = useSuosikitVertailuData(oids);
  const { data } = queryResult;

  return (
    <QueryResult queryResult={queryResult}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box alignSelf="flex-end">
          <SiirryHakulomakkeelleButton data={data} />
        </Box>
        <VertailuFieldMask />
        <Box
          display="flex"
          role="list"
          gap={3}
          flexWrap="wrap"
          alignItems="flex-start"
          data-testid="suosikit-vertailu-list">
          {data?.map((hakukohdeSuosikki) => (
            <VertailuKortti
              key={hakukohdeSuosikki.hakukohdeOid}
              vertailuSuosikki={hakukohdeSuosikki}
              data={data}
            />
          ))}
        </Box>
      </Box>
    </QueryResult>
  );
};

export const SuosikitVertailuPage = () => {
  const { t } = useTranslation();
  const vertailuSuosikit = useVertailuSuosikit();

  const vertailuCount = vertailuSuosikit.length;

  return (
    <ContentWrapper>
      <Box width="100%" alignSelf="start">
        <Murupolku
          path={[
            { name: t('suosikit.otsikko'), link: 'suosikit' },
            { name: t('suosikit-vertailu.otsikko') },
          ]}
        />
      </Box>
      <Heading variant="h1">{t('suosikit-vertailu.otsikko')}</Heading>
      <HeadingBoundary>
        {vertailuCount > 0 ? (
          <Vertailu oids={vertailuSuosikit} />
        ) : (
          t('suosikit-vertailu.ei-vertailtavia-suosikkeja')
        )}
      </HeadingBoundary>
    </ContentWrapper>
  );
};
