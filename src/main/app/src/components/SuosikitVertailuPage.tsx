import React from 'react';

import { Box, Link, Paper, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { getHakukohdeSuosikitVertailu } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { NDASH } from '#/src/constants';
import {
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';
import { useTruncatedKuvaus } from '#/src/hooks/useTruncatedKuvaus';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Koodi } from '#/src/types/common';
import { Kielivalikoima } from '#/src/types/ToteutusTypes';

import { ContentWrapper } from './common/ContentWrapper';
import { KorttiLogo } from './common/KorttiLogo';
import { MaterialIcon, MaterialIconVariant } from './common/MaterialIcon';
import { Murupolku } from './common/Murupolku';
import { QueryResult } from './common/QueryResultWrapper';
import { TextButton } from './common/TextButton';
import { Heading, HeadingBoundary } from './Heading';

const useSuosikitVertailuData = (oids?: Array<string>) =>
  useQuery(
    ['getSuosikitVertailu', oids],
    () => getHakukohdeSuosikitVertailu({ 'hakukohde-oids': oids! }),
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

const List = styled('ul')({
  textIndent: 0,
  paddingLeft: '20px',
});

const Valintakokeet = ({ valintakokeet }: { valintakokeet: Array<any> }) => {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {valintakokeet.map((valintakoe) => (
        <Link key={valintakoe.id} href="TODO">
          {localize(valintakoe.tyyppi)}
        </Link>
      ))}
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

  const year = 2022; // TODO

  return (
    <PaperWithAccent key={hakukohde.hakukohdeOid} role="listitem">
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
        <InfoItem
          icon="public"
          label={t('suosikit-vertailu.kayntiosoite')}
          value={localize(hakukohde.osoite)}
        />
        <InfoItem
          icon="door_back"
          iconVariant="outlined"
          label={t('suosikit-vertailu.sisaanpaasyn-alin-pistemaara', { year })}
          value="TODO"
        />
        <InfoItem
          icon="people_outline"
          label={t('suosikit-vertailu.opiskelijoita')}
          value={hakukohde.opiskelijoita}
        />
        <InfoItem
          icon="school"
          iconVariant="outlined"
          label={t('suosikit-vertailu.koe-tai-lisanaytto')}
          value={<Valintakokeet valintakokeet={hakukohde.valintakokeet} />}
        />
        <InfoItem
          icon="school"
          iconVariant="outlined"
          label={t('suosikit-vertailu.kaksoistutkinto')}
          value={
            hakukohde.toinenAsteOnkoKaksoistutkinto
              ? t('suosikit-vertailu.voi-suorittaa-kaksoistutkinnon')
              : NDASH
          }
        />
        <InfoItem
          icon="verified"
          iconVariant="outlined"
          label={t('suosikit-vertailu.lukiodiplomit')}
          value={<KoodiLista koodit={hakukohde.lukiodiplomit} />}
        />
        <InfoItem
          icon="chat_bubble_outline"
          label={t('suosikit-vertailu.kielivalikoima')}
          value={<Kielet kielivalikoima={hakukohde.kielivalikoima} />}
        />
        <InfoItem
          icon="lightbulb"
          iconVariant="outlined"
          label={t('suosikit-vertailu.osaamisalat')}
          value={<KoodiLista koodit={hakukohde.osaamisalat} />}
        />
        {hakukohde.jarjestaaUrheilijanAmmKoulutusta && (
          <InfoItem
            icon="sports_soccer"
            value={t('suosikit-vertailu.jarjestaa-urheilijan-amm-koulutusta')}
          />
        )}
        <hr />
        <Box display="flex" justifyContent="flex-end" flexWrap="wrap" gap={1}>
          <TextButton onClick={() => toggleVertailu(hakukohde.hakukohdeOid)}>
            {t('suosikit.poista-vertailusta')}
          </TextButton>
        </Box>
      </Box>
    </PaperWithAccent>
  );
};

const Vertailu = ({ oids }: { oids: Array<string> }) => {
  const queryResult = useSuosikitVertailuData(oids);
  const { data } = queryResult;

  return (
    <QueryResult queryResult={queryResult}>
      <Box display="flex" flexDirection="column" gap={2}>
        <HeadingBoundary>
          <Box display="flex" role="list" data-testid="suosikit-list" gap={3}>
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
      {vertailuCount > 0 ? (
        <Vertailu oids={oids} />
      ) : (
        t('suosikit-vertailu.ei-vertailtavia-suosikkeja')
      )}
    </ContentWrapper>
  );
};
