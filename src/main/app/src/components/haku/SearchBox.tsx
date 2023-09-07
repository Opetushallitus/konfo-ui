import React, { useMemo, useState } from 'react';

import {
  Box,
  InputBase,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  Typography,
  Paper,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import { TFunction } from 'i18next';
import { identity, isString, omit, size } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { match } from 'ts-pattern';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useAutocompleteOptions } from '#/src/hooks/useAutocompleteOptions';
import { styled, theme } from '#/src/theme';
import { AutocompleteOption } from '#/src/types/common';

import { getToteutustenTarjoajat } from './hakutulos/hakutulosKortit/getToteutustenTarjoajat';
import { useAutoComplete } from './hakutulosHooks';
import { SearchButton } from './SearchButton';

const checkIsKeywordValid = (word: string) => size(word) === 0 || size(word) > 2;

const createRenderOption = (t: TFunction) => {
  return function KonfoAutocompleteOption(
    props: React.HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption
  ) {
    return (
      <li {...props} style={{ display: 'block' }} key={option.link}>
        <Box>{option.label}</Box>
        {match(option)
          .with({ type: 'koulutus' }, (k) => {
            const tarjoajatText = getToteutustenTarjoajat(t, k.toteutustenTarjoajat);
            return tarjoajatText ? (
              <Box display="flex" alignItems="center" flexDirection="row">
                <MaterialIcon variant="outlined" icon="home_work" />
                <Typography pl={1} variant="body2">
                  {tarjoajatText}
                </Typography>
              </Box>
            ) : null;
          })
          .otherwise(() => null)}
      </li>
    );
  };
};

const createRenderInput = (t: TFunction) => {
  return function KonfoAutocompleteInput(params: AutocompleteRenderInputParams) {
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
        placeholder={t('haku.kehoite')}
        {...InputProps}
        {...rest}
      />
    );
  };
};

const AutocompleteGroupList = styled('ul')`
  list-style-type: 'none';
  margin: 0;
  padding: 0;
  &[data-title]::before {
    content: attr(data-title);
    display: block;
    font-weight: bold;
    padding: ${theme.spacing(1)};
    border-top: 1px solid ${colors.lightGrey};
    border-bottom: 1px solid ${colors.lightGrey};
  }
`;

const getTranslationKey = (entity: string) =>
  match(entity)
    .with('koulutus', () => 'haku.koulutukset')
    .with('oppilaitos', () => 'haku.oppilaitokset')
    .otherwise(() => '');

const createRenderAutocompleteGroup = (t: TFunction) => {
  return function KonfoAutocompleteGroup({
    key,
    group,
    children,
  }: AutocompleteRenderGroupParams) {
    const title = t(getTranslationKey(group));
    return (
      <li key={key}>
        <nav aria-label={title}>
          <AutocompleteGroupList data-title={title}>{children}</AutocompleteGroupList>
        </nav>
      </li>
    );
  };
};

const useIsOptionEqualToValue = () => {
  const { pathname, search: urlSearch } = useLocation();
  return (option: AutocompleteOption) => option.link === pathname + urlSearch;
};

export const SearchBox = ({
  keyword,
  doSearch,
  rajaaButton,
}: {
  keyword: string;
  doSearch: (keyword: string) => void;
  rajaaButton?: JSX.Element | null;
}) => {
  const { setSearchPhraseDebounced, isFetching, data } = useAutoComplete();

  const [inputValue, setInputValue] = useState<string>(() => keyword || '');
  const isKeywordValid = checkIsKeywordValid(inputValue);

  const { t } = useTranslation();

  const koulutusOptions = useAutocompleteOptions(
    inputValue,
    'koulutus',
    t,
    data?.koulutukset
  );
  const oppilaitosOptions = useAutocompleteOptions(
    inputValue,
    'oppilaitos',
    t,
    data?.oppilaitokset
  );

  const allHits = useMemo(
    () => [...koulutusOptions, ...oppilaitosOptions],
    [koulutusOptions, oppilaitosOptions]
  );

  const navigate = useNavigate();
  const isOptionEqualToValue = useIsOptionEqualToValue();

  return (
    <Paper
      component="form"
      onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const keywordValue = formData.get('keyword')?.toString() ?? '';
        doSearch(keywordValue);
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
      }}
      elevation={4}>
      <Tooltip
        placement="bottom-start"
        open={!isKeywordValid}
        title={t('haku.syota-ainakin-kolme-merkkia') || ''}>
        <Autocomplete
          fullWidth={true}
          key={keyword}
          inputValue={inputValue}
          freeSolo={true}
          isOptionEqualToValue={isOptionEqualToValue}
          options={allHits}
          filterOptions={identity}
          noOptionsText={t('haku.ei-ehdotuksia')}
          loadingText={t('haku.lataus-käynnissä')}
          loading={isFetching}
          groupBy={(option) => option.type}
          onChange={(_e, val) => {
            if (!isString(val) && val?.link) {
              navigate(val.link);
            }
          }}
          onInputChange={(_e, newInputValue, reason) => {
            if (reason !== 'reset') {
              setInputValue(newInputValue);
              setSearchPhraseDebounced(newInputValue);
            }
          }}
          renderGroup={createRenderAutocompleteGroup(t)}
          renderOption={createRenderOption(t)}
          renderInput={createRenderInput(t)}
        />
      </Tooltip>
      {rajaaButton}
      <SearchButton isKeywordValid={isKeywordValid} />
    </Paper>
  );
};
