import React from 'react';

import { Box, FormControlLabel, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikitVertailu } from '#/src/api/konfoApi';
import { NDASH } from '#/src/constants';
import {
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import {
  SuosikitVertailuMask,
  useSuosikitVertailuMask,
} from '#/src/hooks/useSuosikitVertailu';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';
import { Kielivalikoima } from '#/src/types/ToteutusTypes';

import { ContentWrapper } from './common/ContentWrapper';
import { KonfoCheckbox } from './common/KonfoCheckbox';
import { KorttiLogo } from './common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from './common/MaterialIcon';
import { Murupolku } from './common/Murupolku';
import { QueryResult } from './common/QueryResultWrapper';
import { TextButton } from './common/TextButton';
import { Heading, HeadingBoundary } from './Heading';
import { PaperWithTopColor } from './PaperWithTopColor';

const useSuosikitVertailuData = (oids?: Array<string>) =>
  useQuery(
    ['getSuosikitVertailu', oids],
    () => getHakukohdeSuosikitVertailu({ 'hakukohde-oids': oids! }),
    {
      enabled: !isEmpty(oids),
    }
  );

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
  return value ? (
    <Box display="flex" gap={1}>
      <MaterialIcon icon={icon} variant={iconVariant} color="primary" />
      <Box display="flex" flexDirection="column">
        {label && <Typography>{label}</Typography>}
        <Typography component="div" display="flex" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Box>
  ) : null;
};

type VertailuSuosikki = any;

const FIELDS_ORDER: Array<{
  icon: MaterialIconName;
  iconVariant?: MaterialIconVariant;
  fieldId: keyof SuosikitVertailuMask;
  getLabel?: (t: TFunction, vertailuSuosikki?: VertailuSuosikki) => string;
  renderValue?: (vertailuSuosikki: VertailuSuosikki, t: TFunction) => React.ReactNode;
}> = [
  {
    icon: 'public',
    iconVariant: 'outlined',
    fieldId: 'kayntiosoite',
    getLabel: (t) => t('suosikit-vertailu.kayntiosoite'),
    renderValue: (vertailuSuosikki) => localize(vertailuSuosikki.osoite),
  },
  {
    icon: 'door_back',
    iconVariant: 'outlined',
    fieldId: 'sisaanpaasyn-pistemaara',
    getLabel: (t, vertailuSuosikki) =>
      t('suosikit-vertailu.sisaanpaasyn-alin-pistemaara', {
        year: vertailuSuosikki?.edellinenHaku?.vuosi,
      }),
    renderValue: (vertailuSuosikki) => vertailuSuosikki?.edellinenHaku?.pisteet,
  },
  {
    icon: 'people_outline',
    fieldId: 'opiskelijoita',
    getLabel: (t) => t('suosikit-vertailu.opiskelijoita'),
    renderValue: (vertailuSuosikki) => vertailuSuosikki.opiskelijoita,
  },
  {
    icon: 'school',
    iconVariant: 'outlined',
    fieldId: 'valintakoe',
    getLabel: (t) => t('suosikit-vertailu.koe-tai-lisanaytto'),
    renderValue: (vertailuSuosikki) =>
      isEmpty(vertailuSuosikki.valintakokeet) ? null : (
        <Valintakokeet valintakokeet={vertailuSuosikki.valintakokeet} />
      ),
  },
  {
    icon: 'school',
    iconVariant: 'outlined',
    fieldId: 'kaksoistutkinto',
    getLabel: (t) => t('suosikit-vertailu.kaksoistutkinto'),
    renderValue: (vertailuSuosikki, t) =>
      vertailuSuosikki.toinenAsteOnkoKaksoistutkinto
        ? t?.('suosikit-vertailu.voi-suorittaa-kaksoistutkinnon')
        : NDASH,
  },
  {
    icon: 'verified',
    iconVariant: 'outlined',
    fieldId: 'lukiodiplomit',
    getLabel: (t) => t('suosikit-vertailu.lukiodiplomit'),
    renderValue: (vertailuSuosikki) =>
      vertailuSuosikki.koulutustyyppi !== 'lk' &&
      isEmpty(vertailuSuosikki.lukiodiplomit) ? null : (
        <KoodiLista koodit={vertailuSuosikki.lukiodiplomit} />
      ),
  },
  {
    icon: 'chat_bubble_outline',
    fieldId: 'kielivalikoima',
    getLabel: (t: TFunction) => t('suosikit-vertailu.kielivalikoima'),
    renderValue: (vertailuSuosikki: VertailuSuosikki) =>
      isEmpty(vertailuSuosikki.kielivalikoima) ? null : (
        <Kielet kielivalikoima={vertailuSuosikki.kielivalikoima} />
      ),
  },
  {
    icon: 'lightbulb',
    iconVariant: 'outlined',
    fieldId: 'osaamisalat',
    getLabel: (t: TFunction) => t('suosikit-vertailu.osaamisalat'),
    renderValue: (vertailuSuosikki: VertailuSuosikki) =>
      isEmpty(vertailuSuosikki.osaamisalat) ? null : (
        <KoodiLista koodit={vertailuSuosikki.osaamisalat} />
      ),
  },
  {
    icon: 'sports_soccer',
    fieldId: 'urheilijan-amm-koulutus',
    renderValue: (vertailuSuosikki: VertailuSuosikki, t: TFunction) =>
      isEmpty(vertailuSuosikki.jarjestaaUrheilijanAmmKoulutusta)
        ? t('suosikit-vertailu.jarjestaa-urheilijan-amm-koulutusta')
        : null,
  },
];

const List = styled('ul')({
  textIndent: 0,
  paddingLeft: '20px',
});

const Valintakokeet = ({ valintakokeet }: { valintakokeet: Array<any> }) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {isEmpty(valintakokeet)
        ? t('suosikit-vertailu.ei-valintakokeita')
        : valintakokeet.map((valintakoe) => localize(valintakoe))}
    </Box>
  );
};

const Kielet = ({ kielivalikoima }: { kielivalikoima?: Kielivalikoima }) => {
  const { t } = useTranslation();
  return isEmpty(kielivalikoima) ? null : (
    <Box>
      {Object.entries(kielivalikoima ?? {})?.map(([kieliKey, kieliValue]) =>
        isEmpty(kieliValue) ? null : (
          <Box key={kieliKey} display="flex" gap={1}>
            <Box flexShrink={0}>{t(`toteutus.${kieliKey}`)}: </Box>
            <Box>{kieliValue?.map((kieli) => localize(kieli)).join(', ')}</Box>
          </Box>
        )
      )}
    </Box>
  );
};

const KoodiLista = ({ koodit }: { koodit: Array<{ koodi: Koodi }> }) =>
  isEmpty(koodit) ? null : (
    <List>
      {koodit?.map((k) => <li key={k?.koodi.koodiUri}>{localize(k?.koodi.nimi)}</li>)}
    </List>
  );

const VertailuKortti = ({
  hakukohde: hakukohde,
}: {
  hakukohde: any;
  removed?: boolean;
}) => {
  const { t } = useTranslation();
  const { toggleVertailu } = useSuosikitSelection();

  const kuvaus = useTruncatedKuvaus(localize(hakukohde.esittely));

  const { mask } = useSuosikitVertailuMask();

  return (
    <PaperWithTopColor
      key={hakukohde.hakukohdeOid}
      role="listitem"
      sx={{ flex: '1 1 350px' }}>
      <KorttiLogo
        entity="oppilaitos"
        src={hakukohde.logo}
        alt={t('haku.oppilaitoksen-logo')}
        display="inline-block"
        position="relative"
        maxWidth="50px"
        marginRight={2}
        sx={{
          float: 'left',
        }}
      />
      <Typography variant="body1">{localize(hakukohde.jarjestyspaikka)}</Typography>
      <Heading variant="h4">{localize(hakukohde.nimi)}</Heading>
      <Typography>{kuvaus}</Typography>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        flexWrap="wrap"
        mt={2}
        gap={2}>
        {FIELDS_ORDER.map(({ icon, iconVariant, getLabel, renderValue, fieldId }) => {
          return mask[fieldId] ? (
            <InfoItem
              key={fieldId}
              icon={icon}
              iconVariant={iconVariant}
              label={getLabel?.(t, hakukohde)}
              value={renderValue?.(hakukohde, t)}
            />
          ) : null;
        })}
        <hr />
        <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={1}>
          <TextButton onClick={() => toggleVertailu(hakukohde.hakukohdeOid)}>
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

  return (
    <QueryResult queryResult={queryResult}>
      <Box display="flex" flexDirection="column" gap={2}>
        <HeadingBoundary>
          <Box display="flex" role="list" gap={3} flexWrap="wrap">
            {data?.map((hakukohdeSuosikki) => (
              <VertailuKortti
                key={hakukohdeSuosikki.hakukohdeOid}
                hakukohde={hakukohdeSuosikki}
              />
            ))}
          </Box>
        </HeadingBoundary>
      </Box>
    </QueryResult>
  );
};

const VertailuFieldCheckbox = ({ fieldId }: { fieldId: keyof SuosikitVertailuMask }) => {
  const { t } = useTranslation();
  const { mask, setMask } = useSuosikitVertailuMask();

  return (
    <FormControlLabel
      label={t(`suosikit-vertailu.${fieldId}`)}
      control={
        <KonfoCheckbox
          onClick={() => setMask({ [fieldId]: !mask[fieldId] })}
          checked={mask[fieldId]}
        />
      }
    />
  );
};

const VertailuFieldMask = () => {
  const { t } = useTranslation();
  return (
    <Box
      flexDirection="column"
      display="flex"
      justifyContent="flex-start"
      alignItems="flex-start"
      width="100%"
      m={2}>
      <Heading variant="h5">{t('suosikit-vertailu.valitse-vertailtavat-tiedot')}</Heading>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {FIELDS_ORDER.map(({ fieldId }) => (
          <VertailuFieldCheckbox key={fieldId} fieldId={fieldId} />
        ))}
      </Box>
    </Box>
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
        <VertailuFieldMask />
        {vertailuCount > 0 ? (
          <Vertailu oids={oids} />
        ) : (
          t('suosikit-vertailu.ei-vertailtavia-suosikkeja')
        )}
      </HeadingBoundary>
    </ContentWrapper>
  );
};
