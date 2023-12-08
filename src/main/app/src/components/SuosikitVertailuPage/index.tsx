import React, { useRef } from 'react';

import { Box, Divider, Link, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useContentWidth } from '#/src/hooks/useContentWidth';
import {
  useSuosikitDataOrdered,
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
import { KorttiLogo } from '../common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from '../common/MaterialIcon';
import { Murupolku } from '../common/Murupolku';
import { QueryResult } from '../common/QueryResultWrapper';
import { TextButton } from '../common/TextButton';
import { Heading, HeadingBoundary } from '../Heading';
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

const VertailuKortti = ({
  vertailuSuosikki,
}: {
  vertailuSuosikki: VertailuSuosikki;
  removed?: boolean;
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
          <TextButton onClick={() => toggleVertailu(vertailuSuosikki.hakukohdeOid)}>
            {t('suosikit.poista-vertailusta')}
          </TextButton>
        </Box>
      </Box>
    </PaperWithTopColor>
  );
};

const Vertailu = ({ oids }: { oids: Array<string> }) => {
  const queryResult = useSuosikitVertailuData(oids);

  const { data } = queryResult;
  const orderedData = useSuosikitDataOrdered(data);

  return (
    <QueryResult queryResult={queryResult}>
      <Box display="flex" flexDirection="column" gap={2}>
        <VertailuFieldMask />
        <Box
          display="flex"
          role="list"
          gap={3}
          flexWrap="wrap"
          alignItems="flex-start"
          data-testid="suosikit-vertailu-list">
          {orderedData?.map((hakukohdeSuosikki) => (
            <VertailuKortti
              key={hakukohdeSuosikki.hakukohdeOid}
              vertailuSuosikki={hakukohdeSuosikki}
            />
          ))}
        </Box>
      </Box>
    </QueryResult>
  );
};

export const SuosikitVertailuPage = () => {
  const { t } = useTranslation();
  const oids = useVertailuSuosikit();

  const vertailuCount = oids.length;

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
          <Vertailu oids={oids} />
        ) : (
          t('suosikit-vertailu.ei-vertailtavia-suosikkeja')
        )}
      </HeadingBoundary>
    </ContentWrapper>
  );
};