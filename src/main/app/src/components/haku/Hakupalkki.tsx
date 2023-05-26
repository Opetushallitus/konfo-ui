import React, { useCallback, useMemo, useState } from 'react';

import {
  SearchOutlined,
  ExpandMoreOutlined,
  ExpandLessOutlined,
  HomeWorkOutlined,
} from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Divider,
  Hidden,
  Paper,
  Popover,
  Tooltip,
  IconButton,
  Button,
  Autocomplete,
  InputBase,
  Link,
  AutocompleteRenderGroupParams,
  AutocompleteRenderInputParams,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { size, isEmpty, omit, identity, concat } from 'lodash';
import { TFunction, useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { match } from 'ts-pattern';

import { AutocompleteResult } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useIsAtEtusivu } from '#/src/store/reducers/appSlice';
import { theme } from '#/src/theme';
import { localize } from '#/src/tools/localization';

import { MobileFiltersOnTopMenu } from '../suodattimet/hakutulosSuodattimet/MobileFiltersOnTopMenu';
import { HakupalkkiFilters } from './HakupalkkiFilters';
import {
  ToteutustenTarjoajat,
  getToteutustenTarjoajat,
} from './hakutulos/hakutulosKortit/KoulutusKortti';
import { useAutoComplete, useHakuUrl, useSearch } from './hakutulosHooks';

const PREFIX = 'Hakupalkki';

const classes = {
  box: `${PREFIX}-box`,
  input: `${PREFIX}-input`,
  searchButton: `${PREFIX}-searchButton`,
  mobileFilterButton: `${PREFIX}-mobileFilterButton`,
  mobileIconButton: `${PREFIX}-mobileIconButton`,
  expandButton: `${PREFIX}-expandButton`,
  inputRoot: `${PREFIX}-inputRoot`,
  link: `${PREFIX}-link`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.box}`]: {
    borderLeft: `2px solid ${colors.lightGrey}`,
    paddingLeft: '10px',
    marginLeft: '10px',
  },

  [`& .${classes.input}`]: {
    borderRadius: 0,
    marginLeft: theme.spacing(2),
    flex: 1,
    color: colors.darkGrey,
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '27px',
  },

  [`& .${classes.searchButton}`]: {
    color: colors.white,
    borderRadius: '2px',
    height: '40px',
    width: '114px',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
    marginRight: '20px',
    marginLeft: '20px',
  },

  [`& .${classes.mobileFilterButton}`]: {
    color: colors.white,
    paddingLeft: 0,
    marginTop: '3px',
    fontWeight: 600,
  },

  [`& .${classes.mobileIconButton}`]: {
    marginRight: theme.spacing(1),
  },

  [`& .${classes.expandButton}`]: {
    height: '40px',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    [theme.breakpoints.up('md')]: {
      height: '73px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '58px',
    },
    paddingLeft: '15px',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
  },

  [`& .${classes.link}`]: {
    marginTop: '10px',
    textDecoration: 'underline',
    color: 'white !important',
  },
}));

const ArrowBox = styled(Box)(() => ({
  position: 'relative',
  background: colors.white,
  border: `4px solid ${colors.white}`,
  borderRadius: '4px',
  '&:after, &:before': {
    bottom: '100%',
    left: '50%',
    border: 'solid transparent',
    content: '" "',
    height: 0,
    width: 0,
    position: 'absolute',
    pointerEvents: 'none',
  },

  '&:after': {
    borderColor: 'rgba(136, 183, 213, 0)',
    borderBottomColor: colors.white,
  },
  '&:before': {
    borderColor: 'rgba(194, 225, 245, 0)',
    borderBottomColor: colors.white,
    borderWidth: '25px',
    marginLeft: '-25px',
  },
}));

const StyledPopover = styled(Popover)(() => ({
  '& .MuiPopover-paper': {
    marginTop: '8px',
    paddingTop: '25px',
    background: 'transparent',
  },
}));

const checkIsKeywordValid = (word: string) => size(word) === 0 || size(word) > 2;

type AutocompleteOption =
  | {
      label: string;
      type: 'oppilaitos';
      link: string;
    }
  | {
      label: string;
      type: 'koulutus';
      toteutustenTarjoajat?: ToteutustenTarjoajat;
      link: string;
    };

const AutocompleteOptionLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      color="inherit"
      sx={{
        display: 'block',
        padding: 1,
        width: '100%',
      }}
      to={to}
      component={RouterLink}
      underline="none">
      {children}
    </Link>
  );
};

const createRenderOption =
  (t: TFunction) =>
  (props: React.HTMLAttributes<HTMLLIElement>, option: AutocompleteOption) => {
    return (
      <li {...props} key={option.link} style={{ padding: 0 }}>
        <AutocompleteOptionLink to={option.link}>
          <Box>{option.label}</Box>
          {match(option)
            .with({ type: 'koulutus' }, (k) => {
              const tarjoajatText = getToteutustenTarjoajat(t, k.toteutustenTarjoajat);
              return tarjoajatText ? (
                <Box display="flex" alignItems="center" flexDirection="row">
                  <HomeWorkOutlined />
                  <Typography pl={1} variant="body2">
                    {tarjoajatText}
                  </Typography>
                </Box>
              ) : null;
            })
            .otherwise(() => '')}
        </AutocompleteOptionLink>
      </li>
    );
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

const createRenderAutocompleteGroup =
  ({ t }: { t: TFunction }) =>
  ({ key, group, children }: AutocompleteRenderGroupParams) => {
    const title = t(getTranslationKey(group));
    return (
      <nav aria-label={title} key={key}>
        <AutocompleteGroupList data-title={title}>{children}</AutocompleteGroupList>
      </nav>
    );
  };

const createRenderInput = (t: TFunction) => (params: AutocompleteRenderInputParams) => {
  const { InputProps } = params;
  const rest = omit(params, ['InputProps', 'InputLabelProps']);
  return (
    <InputBase
      data-cy="autocomplete-input"
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

const useAutocompleteOptions = (
  keyword: string,
  type: 'koulutus' | 'oppilaitos',
  t: TFunction,
  response?: AutocompleteResult['koulutukset'] | AutocompleteResult['oppilaitokset']
) => {
  const hits = response?.hits;
  const total = response?.total;

  const { i18n } = useTranslation();
  const lng = i18n.language;

  const hakuUrl = useHakuUrl(keyword, type);
  return useMemo(
    () =>
      isEmpty(hits)
        ? []
        : concat(
            hits?.map?.((k) => ({
              ...omit(k, ['oid', 'nimi']),
              label: localize(k.nimi),
              type,
              link: `/${lng}/${type}/${k.oid}`,
            })) as Array<AutocompleteOption>,
            [
              {
                label: t(`haku.nayta-kaikki-${type}-hakutulokset`, { count: total }),
                type,
                link: hakuUrl,
              },
            ]
          ),
    [hits, total, t, hakuUrl, lng, type]
  );
};

const SearchBox = ({
  keyword,
  doSearch,
  rajaaButton,
}: {
  keyword: string;
  doSearch: any;
  rajaaButton?: JSX.Element | null;
}) => {
  const { setSearchPhraseDebounced, isFetching, data } = useAutoComplete();

  const [inputValue, setInputValue] = useState<string>(() => keyword);
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

  return (
    <Paper
      component="form"
      onSubmit={(event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const keywordValue = formData.get('keyword');
        doSearch(keywordValue);
      }}
      className={classes.inputRoot}
      elevation={4}>
      <Tooltip
        placement="bottom-start"
        open={!isKeywordValid}
        title={t('haku.syota-ainakin-kolme-merkkia') || ''}>
        <Autocomplete
          fullWidth={true}
          key={keyword}
          inputValue={inputValue}
          options={allHits as Array<AutocompleteOption>}
          filterOptions={identity}
          noOptionsText={t('haku.ei-ehdotuksia')}
          loadingText={t('haku.lataus-käynnissä')}
          loading={isFetching}
          groupBy={(option) => option.type}
          onChange={(e, value) => {
            e.preventDefault();
            if (value?.link) {
              navigate(value?.link as any);
            }
          }}
          onInputChange={(_e, newInputValue, reason) => {
            if (reason !== 'reset') {
              setInputValue(newInputValue);
              setSearchPhraseDebounced(newInputValue);
            }
          }}
          renderGroup={createRenderAutocompleteGroup({ t })}
          renderOption={createRenderOption(t)}
          renderInput={createRenderInput(t)}
        />
      </Tooltip>
      {rajaaButton}
      <Hidden mdDown>
        <Button
          startIcon={<SearchOutlined />}
          disabled={!isKeywordValid}
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.searchButton}>
          {t('haku.etsi')}
        </Button>
      </Hidden>
      <Hidden mdUp>
        <IconButton
          disabled={!isKeywordValid}
          type="submit"
          className={classes.mobileIconButton}
          aria-label={t('haku.etsi')}>
          <SearchOutlined />
        </IconButton>
      </Hidden>
    </Paper>
  );
};

export const Hakupalkki = () => {
  const { t } = useTranslation();

  const { keyword, koulutusData, goToSearchPage, setKeyword } = useSearch();
  const koulutusFilters = koulutusData?.filters;
  const isAtEtusivu = useIsAtEtusivu();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleDesktopBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({
      top: 250,
      left: 0,
      behavior: 'smooth',
    });
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

  const doSearch = useCallback(
    (phrase: string) => {
      setKeyword(phrase);
      goToSearchPage();
    },
    [setKeyword, goToSearchPage]
  );

  const id = isPopoverOpen ? 'filters-popover' : undefined;

  const ExpandIcon = () =>
    isPopoverOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />;

  const rajaaButton = isAtEtusivu ? (
    <Hidden smDown>
      <Box component="div" className={classes.box}>
        <Divider orientation="vertical" />
        <Button
          aria-describedby={id}
          endIcon={
            !isPopoverOpen || !isEmpty(koulutusFilters) ? (
              <ExpandIcon />
            ) : (
              <CircularProgress size={25} color="inherit" />
            )
          }
          onClick={handleDesktopBtnClick}
          className={classes.expandButton}>
          {t('haku.rajaa')}
        </Button>
      </Box>
    </Hidden>
  ) : null;

  return (
    <StyledBox display="flex" flexDirection="column" alignItems="flex-end" flexGrow={1}>
      <SearchBox
        key={keyword}
        keyword={keyword}
        doSearch={doSearch}
        rajaaButton={rajaaButton}
      />
      {!isEmpty(koulutusFilters) && (
        <Hidden smDown>
          <StyledPopover
            id={id}
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}>
            <ArrowBox component="div">
              <HakupalkkiFilters />
            </ArrowBox>
          </StyledPopover>
        </Hidden>
      )}
      {isAtEtusivu && (
        <Box
          display="flex"
          flexDirection="row-reverse"
          width="100%"
          justifyContent="space-between">
          <LocalizedLink component={RouterLink} to="/haku" className={classes.link}>
            {t('jumpotron.naytakaikki')}
          </LocalizedLink>
          <Hidden mdUp>
            <MobileFiltersOnTopMenu />
          </Hidden>
        </Box>
      )}
    </StyledBox>
  );
};
