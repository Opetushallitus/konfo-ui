import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  createFilterOptions,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import { isString, last, omit, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useKoulutusSearch } from '#/src/components/haku/hakutulosHooks';
import { GraafiContainer } from '#/src/components/laskuri/graafi/GraafiContainer';
import { HaunHakukohde, useHaku } from '#/src/components/laskuri/hooks';
import { InfoBox } from '#/src/components/laskuri/InfoBox';
import { useToteutus } from '#/src/components/toteutus/hooks';
import { theme } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { useUrlParams } from '#/src/tools/useUrlParams';
import { scrollIntoView } from '#/src/tools/utils';

import { HakupisteLaskelma } from './Keskiarvo';

const PREFIX = 'VertaaHakukohteeseen__';

const classes = {
  container: `${PREFIX}container`,
  input: `${PREFIX}input`,
};

interface SearchKoulutusResult {
  total: number;
  filters: {
    yhteishaku: Record<
      string,
      {
        count: number;
      }
    >;
  };
}

const findHakuOid = (searchData?: SearchKoulutusResult): string | undefined => {
  if (searchData && searchData.total > 0 && searchData.filters?.yhteishaku) {
    const hakuOids = Object.keys(searchData.filters.yhteishaku).filter(
      (oid) => searchData.filters.yhteishaku[oid].count > 0
    );
    if (hakuOids.length > 0) {
      // In case of multiple hits, presuming larger oid values are more recent
      return last(sortBy(hakuOids));
    }
  }
  return undefined;
};

interface Option {
  label: string;
  value: HaunHakukohde;
}

type Props = {
  tulos: HakupisteLaskelma;
};

export const VertaaHakukohteeseen = ({ tulos }: Props) => {
  const { t } = useTranslation();
  const { isDraft } = useUrlParams();
  const [selectedHakukohde, setSelectedHakukohde] = useState<HaunHakukohde | undefined>(
    undefined
  );

  // Using koulutus search to find the latest haku oid
  const { isFetching: isFetchingHakuOid, data: koulutusData } = useKoulutusSearch(
    { page: 1, size: 1, koulutustyyppi: ['lk'] },
    {
      enabled: true,
    }
  );

  const { isFetching: isFetchingHaku, data: haku } = useHaku({
    oid: findHakuOid(koulutusData),
    isDraft,
  });

  const options = useMemo(() => {
    const opts =
      haku?.hakukohteet.map((hakukohde) => {
        const organisaatioNimi = hakukohde.organisaatio
          ? localize(hakukohde.organisaatio.nimi).trim()
          : undefined;
        return {
          label: `${localize(hakukohde.nimi).trim()}${
            organisaatioNimi ? `, ${organisaatioNimi}` : ''
          }`,
          value: hakukohde,
        };
      }) || [];
    return sortBy(opts, ['label']);
  }, [haku?.hakukohteet]);

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
    <Box
      className={classes.container}
      sx={{
        marginTop: theme.spacing(4),
      }}>
      <Typography
        variant="h3"
        sx={{
          fontSize: '1.25rem',
          [theme.breakpoints.down('sm')]: {
            fontSize: '1.2rem',
          },
        }}>
        {t('vertaa-hakukohteeseen.header')}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
        {t('vertaa-hakukohteeseen.vertaa-ohje')}
      </Typography>
      <Paper
        component="form"
        onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.target);
          const keywordValue = formData.get('keyword')?.toString() ?? '';
          console.log('keywordValue', keywordValue);
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
          border: `1px solid ${colors.lightGrey}`,
          borderRadius: '2px',
        }}>
        <Autocomplete
          className={classes.input}
          fullWidth={true}
          freeSolo={true}
          options={options}
          clearText={t('vertaa-hakukohteeseen.tyhjenna')}
          loadingText={t('vertaa-hakukohteeseen.lataus-käynnissä')}
          loading={isFetchingHakuOid || isFetchingHaku}
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
            limit: 50,
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
              variant="h4"
              sx={{
                fontSize: '1rem',
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1rem',
                  marginLeft: theme.spacing(0.25),
                },
              }}>
              {`${localize(selectedHakukohde.nimi).trim()}, ${localize(
                selectedHakukohde.organisaatio.nimi
              )}`}
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
