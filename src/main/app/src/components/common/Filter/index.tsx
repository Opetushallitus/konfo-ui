import React, { useState } from 'react';

import {
  ExpandLess,
  ExpandMore,
  IndeterminateCheckBoxOutlined,
  SearchOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import Select, {
  components,
  GroupBase,
  StylesConfig,
  OptionProps as RSOptionProps,
  DropdownIndicatorProps as RSDropdownIndicatorProps,
} from 'react-select';

import { colors } from '#/src/colors';
import { useConfig } from '#/src/config';
import { localize, localizeIfNimiObject } from '#/src/tools/localization';
import { FilterValue, FilterValues } from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';
import { KonfoCheckbox } from '../Checkbox';

const HIDE_NOT_EXPANDED_AMOUNT = 5;

type OptionType = { label: string; checked?: boolean; id?: string };

type OptionsType = Array<OptionType>;

type Styles = StylesConfig<OptionType, false, GroupBase<OptionType>>;
const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: 'none',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    padding: '6px',
  }),
};

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

type DropdownIndicatorProps = RSDropdownIndicatorProps<
  OptionType,
  false,
  GroupBase<OptionType>
>;
const DropdownIndicator = (props: DropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <SearchOutlined />
  </components.DropdownIndicator>
);

type OptionProps = RSOptionProps<OptionType, false, GroupBase<OptionType>>;

const Option = React.forwardRef(
  ({ data, innerProps, isFocused }: OptionProps, ref: any) => {
    // innerProps contain interaction functions e.g. onClick

    return (
      <ListItem key={data?.id} disablePadding>
        <ListItemButton
          ref={ref}
          {...innerProps}
          dense
          disableGutters
          selected={isFocused}>
          <KonfoCheckbox
            checked={data?.checked}
            disableRipple
            role="presentation"
            style={{ pointerEvents: 'none' }}
          />
          {data?.label}
        </ListItemButton>
      </ListItem>
    );
  }
);

type CheckboxProps = {
  value: FilterValue;
  isCountVisible?: boolean;
  handleCheck: (v: FilterValue) => void;
  indented?: boolean;
  expandButton?: JSX.Element;
};

const FilterCheckbox = ({
  handleCheck,
  indented,
  isCountVisible,
  value,
  expandButton,
}: CheckboxProps) => {
  const { t } = useTranslation();
  const { count, id, nimi, checked } = value;
  const labelId = `filter-list-label-${id}`;

  return (
    <ListItem key={id} disablePadding>
      <ListItemButton
        dense
        disableGutters
        onClick={() => handleCheck(value)}
        sx={{
          marginLeft: indented ? 2 : 0,
        }}>
        <ListItemIcon>
          <KonfoCheckbox
            edge="start"
            checked={checked}
            indeterminateIcon={<IndeterminateCheckBoxOutlined />}
            indeterminate={isIndeterminate(value)}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <SuodatinListItemText
          id={labelId}
          primary={
            // Kaikille suodattimille ei tule backendista käännöksiä
            <Typography style={{ wordWrap: 'break-word' }} variant="body2">
              {localize(nimi) || t(`haku.${id}`)}
            </Typography>
          }
        />
        <Box paddingLeft={1}>{expandButton}</Box>
        {isCountVisible && (
          <Typography marginLeft={1} variant="body2">{`(${count})`}</Typography>
        )}
      </ListItemButton>
    </ListItem>
  );
};

const FilterCheckboxGroup = ({
  defaultExpandAlakoodit,
  isCountVisible,
  handleCheck,
  value,
}: {
  defaultExpandAlakoodit: boolean;
  handleCheck: (v: FilterValue) => void;
  value: FilterValue;
  isCountVisible?: boolean;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultExpandAlakoodit);
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <FilterCheckbox
        value={value}
        handleCheck={handleCheck}
        isCountVisible={isCountVisible}
        expandButton={
          <IconButton
            size="small"
            aria-label={`${localizeIfNimiObject(value)} ${t('haku.nayta-lisarajaimet')}`}
            onClick={handleToggle}
            onFocus={(e) => {
              e.stopPropagation();
            }}
            data-testid={`show-more-${value.id}`}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />
      {isOpen &&
        value.alakoodit?.map((v) => (
          <FilterCheckbox
            key={v.id}
            value={v}
            handleCheck={handleCheck}
            indented
            isCountVisible={isCountVisible}
          />
        ))}
    </>
  );
};

type Props = {
  name: string;
  testId?: string;
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  expandValues?: boolean;
  defaultExpandAlakoodit?: boolean;
  shadow?: boolean;
  onFocus?: () => void;
  onHide?: () => void;
  values: FilterValues;
  handleCheck: (value: any) => void;
  options?: OptionsType;
  optionsLoading?: boolean;
  selectPlaceholder?: string;
  additionalContent?: JSX.Element;
  isHaku?: boolean;
  setFilters: (value: any) => void;
  isCountVisible?: boolean;
};

const isIndeterminate = (v: FilterValue) =>
  !v.checked && Boolean(v.alakoodit?.some((alakoodi) => alakoodi.checked));

// NOTE: Do *not* put redux code here, this component is used both with and without
export const Filter = ({
  name,
  testId,
  expanded,
  elevation = 0,
  // display selected kertoo että näytetään infoa valituista,
  // summaryHidden kertoo että näytetään mutta ei haluta näyttää tekstiä
  // TODO: Liikaa boolean propseja -> huono komponenttirajapinta
  displaySelected = false,
  summaryHidden = false,
  values,
  handleCheck,
  options,
  optionsLoading,
  selectPlaceholder,
  additionalContent,
  expandValues = false,
  defaultExpandAlakoodit = false,
  onFocus,
  onHide,
  isCountVisible: isCountVisibleProp = true,
}: Props) => {
  const { t } = useTranslation();
  const [hideRest, setHideRest] = useState(expandValues);
  const usedName = [name, values?.length === 0 && '(0)'].filter(Boolean).join(' ');

  const config = useConfig();
  const isCountVisible = isCountVisibleProp && config?.naytaFiltterienHakutulosLuvut;

  return (
    <SuodatinAccordion
      disabled={values?.length === 0}
      data-testid={testId}
      elevation={elevation}
      defaultExpanded={expanded}
      square>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            filterName={usedName}
            values={values}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column" wrap="nowrap">
          {additionalContent}
          {options && values.length > HIDE_NOT_EXPANDED_AMOUNT && (
            <Grid item style={{ padding: '20px 0', zIndex: 2 }}>
              <Select
                components={{ DropdownIndicator, LoadingIndicator, Option }}
                styles={customStyles}
                value={[]}
                isLoading={optionsLoading}
                name="district-search"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={selectPlaceholder || t('haku.etsi')}
                onChange={handleCheck}
                onFocus={onFocus}
                onMenuClose={onHide}
                onMenuOpen={onFocus}
                blurInputOnSelect
                onBlur={onHide}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: colors.darkGrey,
                    primary: colors.brandGreen,
                  },
                })}
              />
            </Grid>
          )}
          <Grid item>
            <List style={{ width: '100%' }}>
              {values
                .filter((v) => !v.hidden)
                .map((value, i) => {
                  if (expandValues && hideRest && i >= HIDE_NOT_EXPANDED_AMOUNT) {
                    return null;
                  }

                  return isEmpty(value.alakoodit) ? (
                    <FilterCheckbox
                      key={value.id}
                      value={value}
                      handleCheck={handleCheck}
                      isCountVisible={isCountVisible}
                    />
                  ) : (
                    <FilterCheckboxGroup
                      key={value.id}
                      defaultExpandAlakoodit={defaultExpandAlakoodit}
                      value={value}
                      handleCheck={handleCheck}
                      isCountVisible={isCountVisible}
                    />
                  );
                })}
            </List>
          </Grid>
          {expandValues && values.length > HIDE_NOT_EXPANDED_AMOUNT && (
            <Button
              color="secondary"
              size="small"
              sx={{
                fontSize: 14,
              }}
              endIcon={hideRest ? <ExpandMore /> : <ExpandLess />}
              fullWidth
              onClick={() => setHideRest(!hideRest)}>
              {hideRest ? t('haku.näytä_lisää') : t('haku.näytä_vähemmän')}
            </Button>
          )}
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
