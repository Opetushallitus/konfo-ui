import React from 'react';

import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  useSuosikitDataOrdered,
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { localize } from '#/src/tools/localization';
import { VertailuSuosikki } from '#/src/types/common';

import { useSuosikitVertailuData } from './useSuosikitVertailuData';
import { useSuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VertailuFieldMask } from './VertailuFieldMask';
import { FIELDS_ORDER } from './vertailuFieldsOrder';
import { ContentWrapper } from '../common/ContentWrapper';
import { KorttiLogo } from '../common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from '../common/MaterialIcon';
import { Murupolku } from '../common/Murupolku';
import { QueryResult } from '../common/QueryResultWrapper';
import { TextButton } from '../common/TextButton';
import { Heading, HeadingBoundary } from '../Heading';
import { PaperWithTopColor } from '../PaperWithTopColor';

const InfoItem = ({
  icon,
  iconVariant = 'filled',
  label,
  value,
}: {
  icon: MaterialIconName;
  iconVariant?: MaterialIconVariant;
  label?: string;
  value: React.ReactNode;
}) => {
  const labelId = `${label}_${value}`;
  return value ? (
    <Box display="flex" gap={1}>
      <MaterialIcon icon={icon} variant={iconVariant} color="primary" />
      <Box display="flex" flexDirection="column">
        {label && <Typography id={labelId}>{label}</Typography>}
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
      <Typography variant="body1">
        {localize(vertailuSuosikki.jarjestyspaikka)}
      </Typography>
      <Link href={`toteutus/${vertailuSuosikki.toteutusOid}`}>
        <Heading variant="h4" color="primary">
          {localize(vertailuSuosikki.nimi)}
        </Heading>
      </Link>
      <Typography>{kuvaus}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        flexWrap="wrap"
        marginTop={2}
        gap={2}>
        {FIELDS_ORDER.map(({ icon, iconVariant, getLabel, renderValue, fieldId }) => {
          return mask[fieldId] ? (
            <InfoItem
              key={fieldId}
              icon={icon}
              iconVariant={iconVariant}
              label={getLabel?.(t, vertailuSuosikki)}
              value={renderValue?.(vertailuSuosikki, t)}
            />
          ) : null;
        })}
        <hr />
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
