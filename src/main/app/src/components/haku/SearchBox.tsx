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
import { OphInput } from '@opetushallitus/oph-design-system';
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
import { SearchButton } from './SearchButton';

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

// default: Konfon tyyli (varjostettu laatikko, hakupainike kentän sisällä)
// oph: oph-design-systemin OphInput oletustyyleillä, hakupainike kentän ulkopuolella oikealla
export type SearchBoxVariant = 'default' | 'oph';

const createRenderInput = (
  t: TFunction,
  descriptionId: string,
  variant: SearchBoxVariant,
  rajaaButton: React.JSX.Element | null
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
    const sharedInputProps = {
      ...inputProps,
      'aria-describedby': descriptionId,
      'aria-label': t('haku.kehoite'),
      'aria-labelledby': 'searchbox-label',
      id: 'searchbox-input',
    };

    // Sama rakenne molemmissa varianteissa: rajaa-painike on kentän sisällä oikealla
    // Autocompleten tyhjennyspainikkeen jälkeen. Variantti vaihtaa vain kenttäkomponentin.
    const commonProps = {
      type: 'text',
      name: 'keyword',
      placeholder: t('haku.hakusana'),
      ...InputProps,
      ...rest,
      endAdornment: (
        <>
          {InputProps.endAdornment}
          {rajaaButton}
        </>
      ),
      inputProps: sharedInputProps,
    };

    return variant === 'oph' ? (
      // OphInput oletustyyleillä
      <OphInput {...commonProps} />
    ) : (
      <InputBase
        sx={{
          borderRadius: 0,
          flex: 1,
          width: '100%',
          '& .MuiAutocomplete-input::placeholder': {
            color: colors.grey700,
            opacity: 0.85,
          },
        }}
        {...commonProps}
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

export const SearchBox = ({
  draftKeyword,
  doSearch,
  setDraftKeyword,
  rajaaButton = null,
  variant = 'default',
}: {
  draftKeyword: string;
  doSearch: (keyword: string) => void;
  setDraftKeyword: (keyword: string) => void;
  rajaaButton?: React.JSX.Element | null;
  variant?: SearchBoxVariant;
}) => {
  const isOph = variant === 'oph';
  const { setSearchPhraseDebounced, isFetching, data } = useAutoComplete();

  const [highlightedLabel, setHighlightedLabel] = useState('');
  const [highlightedLink, setHighlightedLink] = useState<string | null>(null);
  const isKeywordValid = checkIsKeywordValid(draftKeyword);

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
      sx={
        isOph
          ? {
              // Ei laatikkoa, varjoa eikä paddingia: kenttä ja hakupainike vierekkäin.
              // stretch: hakupainike venyy hakukentän korkuiseksi.
              display: 'flex',
              width: '100%',
              alignItems: 'stretch',
              gap: 2,
              backgroundColor: 'transparent',
            }
          : {
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
            }
      }
      elevation={isOph ? 0 : 4}>
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
          fullWidth={true}
          sx={{
            // Rajaa-painike on kentän sisällä (createRenderInput). Autocomplete sijoittaa
            // tyhjennyspainikkeen absoluuttisesti kentän oikeaan reunaan, jolloin se menisi
            // rajaa-painikkeen päälle. Palautetaan normaaliin virtaan, jotta järjestys on:
            // teksti, tyhjennyspainike, rajaa-painike.
            '& .MuiAutocomplete-endAdornment': {
              position: 'static',
              transform: 'none',
            },
            // Ei tarvita tyhjennyspainikkeelle varattua lisätilaa oikealla (&&& ohittaa
            // Autocompleten oman, tarkemman säännön)
            '&&& .MuiAutocomplete-inputRoot': {
              paddingRight: theme.spacing(1),
              // Autocompleten oletus flex-wrap: wrap (monivalintojen chipeille) rivittäisi
              // rajaa-painikkeen kentän alle piiloon. Pidetään kaikki samalla rivillä.
              flexWrap: 'nowrap',
            },
            // oph-variantti (OphInput): Autocomplete lisää outlined-kentälle oman 9px paddingin ja
            // muuttaa tekstikentän paddingia, mikä kasvattaa kentän korkeutta. Palautetaan
            // oph-design-systemin oletuspaddingit (kenttä 0, tekstikenttä 8px 12px).
            '&&& .MuiOutlinedInput-root': {
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              '& .MuiAutocomplete-input': {
                padding: theme.spacing(1.5, 2),
              },
            },
          }}
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
          renderInput={createRenderInput(t, hintId, variant, rajaaButton)}
        />
      </Tooltip>
      <SearchButton isKeywordValid={isKeywordValid} variant={variant} />
    </Paper>
  );
};
