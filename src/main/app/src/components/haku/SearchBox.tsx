import React, { useMemo, useState } from 'react';

import {
  Box,
  InputBase,
  InputBaseProps,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  Typography,
  Paper,
  Tooltip,
  Autocomplete,
  SxProps,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { TFunction } from 'i18next';
import { identity, isString, omit, size } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { match } from 'ts-pattern';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useAutocompleteOptions } from '#/src/hooks/useAutocompleteOptions';
import { styled, theme } from '#/src/theme';
import { AutocompleteOption } from '#/src/types/common';

import { getToteutustenTarjoajat } from './hakutulos/hakutulosKortit/getToteutustenTarjoajat';
import { useAutoComplete } from './hakutulosHooks';
import { SEARCH_BUTTON_CLASS, SearchButton } from './SearchButton';

const checkIsKeywordValid = (word: string) => size(word) === 0 || size(word) > 2;

const createRenderOption = (t: TFunction, highlightedLink: string | null) => {
  return function KonfoAutocompleteOption(
    props: React.HTMLAttributes<HTMLLIElement>,
    option: AutocompleteOption
  ) {
    const isHighlighted = option.link === highlightedLink;
    const liProps = omit(props, isHighlighted ? ['key', 'aria-selected'] : ['key']);
    return (
      <li
        key={option.link}
        {...liProps}
        style={{
          ...(liProps as { style?: React.CSSProperties }).style,
          display: 'block',
        }}>
        <Box role="presentation">{option.label}</Box>
        {match(option)
          .with({ type: 'koulutus' }, (k) => {
            const tarjoajatText = getToteutustenTarjoajat(t, k.toteutustenTarjoajat);
            return tarjoajatText ? (
              <Box
                display="flex"
                alignItems="center"
                flexDirection="row"
                role="presentation">
                <MaterialIcon variant="outlined" icon="home_work" role="presentation" />
                <Typography pl={1} variant="body2" role="presentation">
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

const KonfoInput = styled(InputBase)({
  borderRadius: 0,
  flex: 1,
  width: '100%',
  '& .MuiAutocomplete-input::placeholder': {
    color: colors.grey700,
    opacity: 0.85,
  },
});

type SearchInputComponent = React.ComponentType<Omit<InputBaseProps, 'ref'>>;

const createRenderInput = (
  t: TFunction,
  descriptionId: string,
  InputComponent: SearchInputComponent,
  // Kentän sisään Autocompleten tyhjennyspainikkeen jälkeen sijoitettava sisältö
  endAdornment: React.ReactNode
) => {
  return function KonfoAutocompleteInput(params: AutocompleteRenderInputParams) {
    const { InputProps, inputProps: paramInputProps } = params;
    const rest = omit(params, ['InputProps', 'InputLabelProps', 'inputProps']);
    // MUI passes aria-activedescendant="" when no option is highlighted; empty string
    // causes getElementById("") errors in Firefox
    const inputProps =
      paramInputProps['aria-activedescendant'] === ''
        ? omit(paramInputProps, 'aria-activedescendant')
        : paramInputProps;
    return (
      <InputComponent
        type="text"
        name="keyword"
        placeholder={t('haku.hakusana')}
        {...InputProps}
        {...rest}
        endAdornment={
          endAdornment ? (
            <>
              {InputProps.endAdornment}
              {endAdornment}
            </>
          ) : (
            InputProps.endAdornment
          )
        }
        inputProps={{
          ...inputProps,
          'aria-describedby': descriptionId,
          'aria-label': t('haku.kehoite'),
          'aria-labelledby': 'searchbox-label',
        }}
      />
    );
  };
};

const AutocompleteGroupList = styled('ul')`
  list-style: none;
  margin: 0;
  padding: 0;
  &[data-title]::before {
    content: attr(data-title);
    display: block;
    font-weight: bold;
    padding: ${theme.spacing(1)};
    border-top: 1px solid ${colors.grey500};
    border-bottom: 1px solid ${colors.grey500};
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
        <AutocompleteGroupList role="group" aria-label={title} data-title={title}>
          {children}
        </AutocompleteGroupList>
      </li>
    );
  };
};

// Konfon hakulaatikko: varjostettu laatikko, jonka sisällä kenttä, rajaa- ja hakupainike
const KONFO_FORM_SX: SxProps<Theme> = {
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
  [`& .${SEARCH_BUTTON_CLASS}`]: {
    [theme.breakpoints.up('md')]: {
      display: 'inline-flex',
      fontSize: '16px',
      fontWeight: '600',
      textAlign: 'center',
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
    [theme.breakpoints.down('md')]: {
      marginRight: theme.spacing(1),
    },
  },
};

export type SearchBoxLayoutProps = {
  // Kentän jälkeen sijoitettava rajaa-painike
  rajaaButton?: React.ReactNode;
  // Kenttäkomponentti (oletuksena Konfon tyylinen InputBase)
  InputComponent?: SearchInputComponent;
  // Kentän sisään Autocompleten tyhjennyspainikkeen jälkeen sijoitettava sisältö
  inputEndAdornment?: React.ReactNode;
  // Hakupainike kentän sisään (inputEndAdornmentin jälkeen) kentän perään sijoittamisen sijaan
  searchButtonInInput?: boolean;
  // Lomakkeen (kentän ja painikkeiden) tyylit Konfon hakulaatikon tyylien sijaan
  sx?: SxProps<Theme>;
};

export const SearchBox = ({
  draftKeyword,
  doSearch,
  setDraftKeyword,
  rajaaButton = null,
  InputComponent = KonfoInput,
  inputEndAdornment = null,
  searchButtonInInput = false,
  sx = KONFO_FORM_SX,
}: {
  draftKeyword: string;
  doSearch: (keyword: string) => void;
  setDraftKeyword: (keyword: string) => void;
} & SearchBoxLayoutProps) => {
  const { setSearchPhraseDebounced, isFetching, data } = useAutoComplete();

  const [highlightedLabel, setHighlightedLabel] = useState('');
  const [highlightedLink, setHighlightedLink] = useState<string | null>(null);
  const isKeywordValid = checkIsKeywordValid(draftKeyword);

  // Isoilla näytöillä tekstillinen Etsi-painike, kapeilla pelkkä suurennuslasi
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const searchButton = <SearchButton isKeywordValid={isKeywordValid} mdUp={mdUp} />;

  const { t } = useTranslation();

  const koulutusOptions = useAutocompleteOptions(
    draftKeyword,
    'koulutus',
    t,
    data?.koulutukset
  );
  const oppilaitosOptions = useAutocompleteOptions(
    draftKeyword,
    'oppilaitos',
    t,
    data?.oppilaitokset
  );

  const allHits = useMemo(
    () => [...koulutusOptions, ...oppilaitosOptions],
    [koulutusOptions, oppilaitosOptions]
  );

  const navigate = useNavigate();

  const hintId = 'searchbox-autocomplete-hint';

  return (
    <Paper
      component="form"
      onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const keywordValue = formData.get('keyword')?.toString() ?? '';
        doSearch(keywordValue);
      }}
      sx={sx}
      elevation={4}>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: 1,
          margin: -1,
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          width: 1,
          whiteSpace: 'nowrap',
        }}>
        {highlightedLabel}
      </span>
      <span
        id={hintId}
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: 1,
          margin: -1,
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          width: 1,
          whiteSpace: 'nowrap',
        }}>
        {t('haku.ehdotus-navigoi-sivulle')}
      </span>
      <Tooltip
        placement="bottom-start"
        open={!isKeywordValid}
        title={t('haku.syota-ainakin-kolme-merkkia') || ''}>
        <Autocomplete
          id="searchbox-input"
          fullWidth={true}
          disablePortal={true}
          inputValue={draftKeyword}
          freeSolo={true}
          options={allHits}
          filterOptions={identity}
          noOptionsText={t('haku.ei-ehdotuksia')}
          loadingText={t('haku.lataus-käynnissä')}
          loading={isFetching}
          groupBy={(option) => option.type}
          clearText={t('haku.tyhjenna-hakuehto')}
          slotProps={{
            clearIndicator: {
              tabIndex: 0,
              sx: (muiTheme) => ({
                '&.Mui-focusVisible': {
                  backgroundColor: muiTheme.palette.action.hover,
                },
              }),
            },
          }}
          onHighlightChange={(_e, option) => {
            const isNull = option === null || isString(option);
            setHighlightedLabel(isNull ? '' : option.label);
            setHighlightedLink(isNull ? null : option.link);
          }}
          onChange={(_e, val) => {
            if (!isString(val) && val?.link) {
              navigate(val.link);
            }
          }}
          onInputChange={(_e, newInputValue, reason) => {
            if (reason === 'clear' || reason === 'input') {
              setDraftKeyword(newInputValue);
              setSearchPhraseDebounced(newInputValue);
            }
          }}
          renderGroup={createRenderAutocompleteGroup(t)}
          renderOption={createRenderOption(t, highlightedLink)}
          renderInput={createRenderInput(
            t,
            hintId,
            InputComponent,
            searchButtonInInput ? (
              <>
                {inputEndAdornment}
                {searchButton}
              </>
            ) : (
              inputEndAdornment
            )
          )}
        />
      </Tooltip>
      {rajaaButton}
      {!searchButtonInInput && searchButton}
    </Paper>
  );
};
