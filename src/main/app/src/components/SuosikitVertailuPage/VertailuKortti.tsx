import React, { useRef } from 'react';

import { Box, Divider, Link, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { KorttiLogo } from '#/src/components/common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from '#/src/components/common/MaterialIcon';
import { TextButton } from '#/src/components/common/TextButton';
import { useContentWidth } from '#/src/hooks/useContentWidth';
import { useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';
import { useSyncRefHeight } from '#/src/hooks/useSyncRefHeight';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { localize } from '#/src/tools/localization';
import { VertailuSuosikki } from '#/src/types/common';

import { useSuosikitVertailuMask } from './useSuosikitVertailuMask';
import { VERTAILU_FIELDS_ORDER } from './VERTAILU_FIELDS_ORDER';
import { Heading } from '../Heading';
import { PaperWithTopColor } from '../PaperWithTopColor';

const useIsContentSmall = () => {
  const theme = useTheme();

  const contentWidth = useContentWidth();
  return contentWidth <= theme.breakpoints.values['sm'];
};

const InfoItem = ({
  fieldId,
  icon,
  iconVariant,
  label,
  value,
}: {
  fieldId: string;
  icon: MaterialIconName;
  iconVariant: MaterialIconVariant;
  label?: string;
  value: React.ReactNode;
}) => {
  const labelId = `${label}_${value}`;

  const itemsRef = useRef(null);

  const isContentSmall = useIsContentSmall();

  useSyncRefHeight([[fieldId, itemsRef]], { enabled: !isContentSmall });

  return value ? (
    <Box display="flex" gap={1} ref={itemsRef}>
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

export const VertailuKortti = ({
  vertailuSuosikki,
}: {
  vertailuSuosikki: VertailuSuosikki;
}) => {
  const { t } = useTranslation();
  const { toggleVertailu } = useSuosikitSelection();
  const kuvaus = useTruncatedKuvaus(localize(vertailuSuosikki.esittely));
  const { mask } = useSuosikitVertailuMask();

  const headerRef = useRef(null);
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
        <Heading variant="h4" color="primary">
          <Typography variant="body1">
            {localize(vertailuSuosikki.oppilaitosNimi)}
          </Typography>
          <Link href={`toteutus/${vertailuSuosikki.toteutusOid}`}>
            {localize(vertailuSuosikki.nimi)}
          </Link>
        </Heading>
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
            return mask[fieldId] ? (
              <InfoItem
                key={fieldId}
                fieldId={fieldId}
                icon={icon}
                iconVariant={iconVariant}
                label={getLabel?.(t, vertailuSuosikki)}
                value={renderValue?.(vertailuSuosikki, t)}
              />
            ) : null;
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
