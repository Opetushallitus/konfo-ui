import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Box,
  InputBase,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import { isString, omit, size } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { GraafiContainer } from '#/src/components/laskuri/graafi/GraafiContainer';
import { useToteutuksetKoulutuksittain } from '#/src/components/laskuri/hooks';
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

const checkIsKeywordValid = (word: string) => size(word) === 0 || size(word) > 2;

interface Option {
  label: string;
  value: string;
}

type Props = {
  tulos: HakupisteLaskelma;
};

export const VertaaHakukohteeseen = ({ tulos }: Props) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState<string>(() => '');
  const [toteutusOid, setToteutusOid] = useState<string | undefined>(undefined);
  const isKeywordValid = checkIsKeywordValid(inputValue);
  const { isFetching, data } = useToteutuksetKoulutuksittain({
    keyword: inputValue,
    searchLanguage: 'fi',
  });

  const hits = useMemo(
    () =>
      data?.hits
        .map((hit) => {
          return hit.toteutukset?.map((toteutus) => {
            const oppilaitosNimi = toteutus.oppilaitosNimi
              ? localize(toteutus.oppilaitosNimi)
              : undefined;
            return {
              label: `${localize(toteutus.toteutusNimi)}${
                oppilaitosNimi ? `, ${oppilaitosNimi}` : ''
              }`,
              value: toteutus.toteutusOid,
            };
          });
        })
        .flat() || [],
    [data?.hits]
  );

  const { isDraft } = useUrlParams();
  const { data: toteutus } = useToteutus({
    oid: toteutusOid,
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
        <Tooltip
          placement="bottom-start"
          open={!isKeywordValid}
          title={t('vertaa-hakukohteeseen.syota-ainakin-kolme-merkkia') || ''}>
          <Autocomplete
            fullWidth={true}
            inputValue={inputValue}
            freeSolo={true}
            options={hits}
            clearText={t('vertaa-hakukohteeseen.tyhjenna')}
            loadingText={t('vertaa-hakukohteeseen.lataus-käynnissä')}
            loading={isFetching}
            onChange={(_e, val) => {
              if (!isString(val) && val?.value) {
                setToteutusOid(val?.value);
              }
            }}
            onInputChange={(_e, newInputValue, reason) => {
              if (reason === 'clear') {
                setInputValue('');
                setToteutusOid(undefined);
              } else {
                setInputValue(newInputValue);
              }
            }}
            className={classes.input}
            renderOption={(
              props: React.HTMLAttributes<HTMLLIElement>,
              option: Option
            ) => {
              return (
                <li {...props} style={{ display: 'block' }} key={option.value}>
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
        </Tooltip>
        <MaterialIcon
          icon="search"
          color="disabled"
          sx={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(2),
          }}
        />
      </Paper>
      {inputValue && Boolean(toteutus) && toteutusOid === toteutus?.oid && (
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
            {localize(toteutus?.nimi)}
          </Typography>
          <InfoBox />
          <GraafiContainer
            tulos={tulos}
            hakutiedot={toteutus?.hakutiedot || []}
            isLukio={toteutus?.koulutustyyppi === 'lk'}
          />
        </Box>
      )}
    </Box>
  );
};
