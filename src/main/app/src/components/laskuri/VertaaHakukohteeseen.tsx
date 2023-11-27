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
import { isString, omit, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { GraafiContainer } from '#/src/components/laskuri/graafi/GraafiContainer';
import { HaunHakukohde, useGetHaku } from '#/src/components/laskuri/hooks';
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

interface Option {
  label: string;
  value: HaunHakukohde;
}

type Props = {
  tulos: HakupisteLaskelma;
};

const sanitize = (oid: string | undefined): string | null => {
  return isString(oid) ? oid.replace(/[^0-9.]/gm, '') : null;
};

export const VertaaHakukohteeseen = ({ tulos }: Props) => {
  const { t } = useTranslation();
  const { isDraft, search } = useUrlParams();
  const [selectedHakukohde, setSelectedHakukohde] = useState<HaunHakukohde | undefined>(
    undefined
  );

  const { isFetching, data } = useGetHaku({
    // Parse haku oid from url params
    oid: sanitize(search?.haku as string) || '1.2.246.562.29.00000000000000038404',
    isDraft,
  });

  const options = useMemo(() => {
    const opts =
      data?.hakukohteet.map((hakukohde) => {
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
  }, [data?.hakukohteet]);

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
          fullWidth={true}
          freeSolo={true}
          options={options}
          clearText={t('vertaa-hakukohteeseen.tyhjenna')}
          loadingText={t('vertaa-hakukohteeseen.lataus-käynnissä')}
          loading={isFetching}
          onChange={(_e, val) => {
            if (!isString(val) && val?.value) {
              setSelectedHakukohde(val?.value);
            }
          }}
          onInputChange={(_, input, reason) => {
            if (reason === 'clear') {
              setSelectedHakukohde(undefined);
            }
          }}
          className={classes.input}
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
        selectedHakukohde.toteutus.oid === toteutus?.oid && (
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
              {`${localize(selectedHakukohde?.nimi).trim()}, ${localize(
                selectedHakukohde?.organisaatio.nimi
              )}`}
            </Typography>
            <InfoBox />
            <GraafiContainer
              tulos={tulos}
              hakutiedot={toteutus?.hakutiedot || []}
              isLukio={toteutus?.koulutustyyppi === 'lk'}
              hakukohdeOid={selectedHakukohde?.oid}
            />
          </Box>
        )}
    </Box>
  );
};
