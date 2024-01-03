import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  createFilterOptions,
  InputBase,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { isString, omit, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { GraafiContainer } from '#/src/components/laskuri/graafi/GraafiContainer';
import { useHakukohdeSearch } from '#/src/components/laskuri/hooks';
import { InfoBox } from '#/src/components/laskuri/InfoBox';
import { HakupisteLaskelma } from '#/src/components/laskuri/Keskiarvo';
import { useToteutus } from '#/src/components/toteutus/hooks';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { scrollIntoView } from '#/src/tools/utils';
import { CompactHakukohde } from '#/src/types/common';

interface Option {
  label: string;
  value: CompactHakukohde;
}

type Props = {
  tulos: HakupisteLaskelma;
};

const hakukohdeLabel = (hakukohde: CompactHakukohde) => {
  const jarjestyspaikkaNimi = hakukohde.jarjestyspaikka
    ? localize(hakukohde.jarjestyspaikka.nimi).trim()
    : undefined;
  const organisaatioNimi = hakukohde.organisaatio
    ? localize(hakukohde.organisaatio.nimi).trim()
    : undefined;
  return `${localize(hakukohde.nimi).trim()}${
    organisaatioNimi ? `, ${organisaatioNimi}` : ''
  }${
    jarjestyspaikkaNimi && jarjestyspaikkaNimi !== organisaatioNimi
      ? `, ${jarjestyspaikkaNimi}`
      : ''
  }`;
};

export const VertaaHakukohteeseen = ({ tulos }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isDraft } = useUrlParams();
  const [selectedHakukohde, setSelectedHakukohde] = useState<
    CompactHakukohde | undefined
  >(undefined);

  const { isFetching: isFetchingHakukohteet, data: searchResult } = useHakukohdeSearch({
    kohdejoukko: 'haunkohdejoukko_11',
  });

  const options = useMemo(() => {
    const opts =
      searchResult?.hits
        .filter((hakukohde) =>
          Boolean(
            hakukohde &&
              [
                KOULUTUS_TYYPPI.AMM.toString(),
                KOULUTUS_TYYPPI.LUKIOKOULUTUS.toString(),
              ].includes(hakukohde.koulutustyyppi) &&
              !hakukohde.ammatillinenPerustutkintoErityisopetuksena
          )
        )
        .map((hakukohde) => {
          return {
            label: hakukohdeLabel(hakukohde),
            value: hakukohde,
          };
        }) || [];
    return sortBy(opts, ['label']);
  }, [searchResult?.hits]);

  const { data: toteutus } = useToteutus({
    oid: selectedHakukohde?.toteutus.oid,
    isDraft,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && !contentRef.current.hidden) {
      scrollIntoView(contentRef.current);
    }
  }, [toteutus, contentRef]);

  return (
    <Box marginTop={4}>
      <Typography variant="h4">{t('vertaa-hakukohteeseen.header')}</Typography>
      <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
        {t('vertaa-hakukohteeseen.vertaa-ohje')}
      </Typography>
      <Paper
        component="form"
        onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
        }}
        sx={{
          [theme.breakpoints.up('md')]: {
            height: theme.spacing(9),
          },
          [theme.breakpoints.down('sm')]: {
            height: theme.spacing(7),
          },
          paddingLeft: theme.spacing(2),
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          boxSizing: 'border-box',
          border: `1px solid ${colors.grey500}`,
          borderRadius: '2px',
        }}>
        <Autocomplete
          fullWidth={true}
          freeSolo={true}
          options={options}
          clearText={t('vertaa-hakukohteeseen.tyhjenna')}
          loadingText={t('vertaa-hakukohteeseen.lataus-käynnissä')}
          loading={isFetchingHakukohteet}
          onChange={(_e, val) => {
            if (!isString(val) && val?.value) {
              setSelectedHakukohde(val?.value);
            }
          }}
          onInputChange={(_e, _i, reason) => {
            if (reason === 'clear') {
              setSelectedHakukohde(undefined);
            }
          }}
          filterOptions={createFilterOptions({
            matchFrom: 'any',
            stringify: (option) => option.label,
            trim: true,
            limit: 3000,
          })}
          renderOption={(props: React.HTMLAttributes<HTMLLIElement>, option: Option) => {
            return (
              <li {...props} style={{ display: 'block' }} key={option.value.oid}>
                <Box>{option.label}</Box>
              </li>
            );
          }}
          renderInput={(params: AutocompleteRenderInputParams) => {
            const { InputProps } = params;
            const rest = omit(params, ['InputProps', 'InputLabelProps']);
            return (
              <InputBase
                sx={{
                  borderRadius: 0,
                  flex: 1,
                  width: '100%',
                }}
                type="text"
                name="keyword"
                placeholder={t('vertaa-hakukohteeseen.etsi-hakukohteita')}
                {...InputProps}
                {...rest}
              />
            );
          }}
        />
        <MaterialIcon
          icon="search"
          color="disabled"
          sx={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(2),
          }}
        />
      </Paper>
      {selectedHakukohde &&
        toteutus &&
        selectedHakukohde.toteutus.oid === toteutus.oid && (
          <Box
            ref={contentRef}
            sx={{
              marginTop: theme.spacing(4),
            }}>
            <Typography
              variant="h5"
              sx={{
                marginBottom: theme.spacing(2),
              }}>
              {hakukohdeLabel(selectedHakukohde)}
            </Typography>
            <InfoBox />
            <GraafiContainer
              tulos={tulos}
              hakutiedot={toteutus.hakutiedot || []}
              isLukio={toteutus.koulutustyyppi === 'lk'}
              hakukohdeOid={selectedHakukohde.oid}
            />
          </Box>
        )}
    </Box>
  );
};
