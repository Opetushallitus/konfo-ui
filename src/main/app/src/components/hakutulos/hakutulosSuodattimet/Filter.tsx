import React, { useState } from 'react';

import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  makeStyles,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
  IndeterminateCheckBoxOutlined,
  SearchOutlined,
} from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import Select, { components } from 'react-select';

import { colors } from '#/src/colors';
import { localize, localizeIfNimiObject } from '#/src/tools/localization';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
  KonfoCheckbox,
  SuodatinListItemText,
} from './CustomizedMuiComponents';
import { SummaryContent } from './SummaryContent';
import { FilterValue } from './SuodatinTypes';

const HIDE_NOT_EXPANDED_AMOUNT = 5;

type Styles = React.ComponentProps<typeof Select>['styles'];
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

// Overridden react-select components

const LoadingIndicator = () => <CircularProgress size={25} color="inherit" />;

type RSDropdownIndicatorProps = React.ComponentProps<typeof components.DropdownIndicator>;
const DropdownIndicator = (props: RSDropdownIndicatorProps) => (
  <components.DropdownIndicator {...props}>
    <SearchOutlined />
  </components.DropdownIndicator>
);

type RSOptionProps = React.ComponentProps<typeof components.Option>;
type OptionProps = {
  data?: { label: string; checked: boolean };
  innerProps: RSOptionProps['innerProps'];
  isFocused: boolean;
};
const Option = ({ data, innerProps, isFocused }: OptionProps) => (
  // innerProps contain interaction functions e.g. onClick
  <ListItem dense button {...innerProps} selected={isFocused}>
    <KonfoCheckbox
      checked={data?.checked}
      disableRipple
      role="presentation"
      style={{ pointerEvents: 'none' }}
    />
    {data?.label}
  </ListItem>
);

const withStyles = makeStyles((theme) => ({
  buttonLabel: {
    fontSize: 14,
  },
  noBoxShadow: {
    boxShadow: 'none',
  },
  intendedCheckbox: {
    paddingLeft: theme.spacing(2.2),
  },
}));

type CheckboxProps = {
  value: FilterValue;
  handleCheck: (v: FilterValue) => void;
  intended?: boolean;
  expandButton?: JSX.Element;
};

const FilterCheckbox = ({
  handleCheck,
  intended,
  value,
  expandButton,
}: CheckboxProps) => {
  const { count, id, nimi, checked } = value;
  const labelId = `list-label-${id}`;
  const classes = withStyles();
  return (
    <ListItem
      key={id}
      dense
      button
      onClick={() => handleCheck(value)}
      className={intended ? classes.intendedCheckbox : ''}>
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
          <>
            <Grid item>{_.isString(nimi) ? nimi : localize(nimi)}</Grid>
          </>
        }
      />
      {expandButton && <ListItemIcon>{expandButton}</ListItemIcon>}
      <ListItemSecondaryAction style={{ right: '4px' }}>
        {`(${count})`}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const FilterCheckboxGroup = ({
  defaultExpandAlakoodit,
  handleCheck,
  value,
}: {
  defaultExpandAlakoodit: boolean;
  handleCheck: (v: FilterValue) => void;
  value: FilterValue;
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultExpandAlakoodit);
  const handleToggle = (e: any) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  return (
    <>
      <FilterCheckbox
        value={value}
        handleCheck={handleCheck}
        expandButton={
          <IconButton
            size="small"
            aria-label={`${localizeIfNimiObject(value)} ${t('haku.nayta-lisarajaimet')}`}
            onClick={handleToggle}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
      />
      {isOpen &&
        value.alakoodit?.map((v) => (
          <FilterCheckbox key={v.id} value={v} handleCheck={handleCheck} intended />
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

  values: Array<FilterValue>;
  handleCheck: (value: FilterValue) => void;
  checkedStr?: string;
  options?: any;
  selectPlaceholder?: string;
  additionalContent?: JSX.Element;
};

export const isIndeterminate = (v: FilterValue) =>
  !v.checked && !!v.alakoodit?.some((alakoodi) => alakoodi.checked);

// NOTE: Do *not* put redux code here, this component is used both with and without
export const Filter = ({
  name,
  testId,
  expanded,
  elevation,
  displaySelected = false,
  summaryHidden = false,
  values,
  handleCheck,
  checkedStr,
  options,
  selectPlaceholder,
  additionalContent,
  expandValues = false,
  defaultExpandAlakoodit = false,
}: Props) => {
  const { t } = useTranslation();
  const classes = withStyles();
  const loading = false;
  const [hideRest, setHideRest] = useState(expandValues);

  return (
    <SuodatinAccordion
      {...(summaryHidden && { className: classes.noBoxShadow })}
      data-cy={testId}
      elevation={elevation}
      defaultExpanded={expanded}>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            selectedFiltersStr={checkedStr}
            maxCharLengthBeforeChipWithNumber={20}
            filterName={name}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column">
          {additionalContent}
          {options && (
            <Grid item style={{ padding: '20px 0' }}>
              <Select
                components={{ DropdownIndicator, LoadingIndicator, Option }}
                styles={customStyles}
                value=""
                isLoading={loading}
                name="district-search"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder={selectPlaceholder}
                onChange={handleCheck}
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
              {values.map((value, i) => {
                if (expandValues && hideRest && i >= HIDE_NOT_EXPANDED_AMOUNT) {
                  return null;
                }

                return _.isEmpty(value.alakoodit) ? (
                  <FilterCheckbox
                    key={value.id}
                    value={value}
                    handleCheck={handleCheck}
                  />
                ) : (
                  <FilterCheckboxGroup
                    key={value.id}
                    defaultExpandAlakoodit={defaultExpandAlakoodit}
                    value={value}
                    handleCheck={handleCheck}
                  />
                );
              })}
            </List>
          </Grid>
          {expandValues && (
            <Button
              color="secondary"
              size="small"
              classes={{ label: classes.buttonLabel }}
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
