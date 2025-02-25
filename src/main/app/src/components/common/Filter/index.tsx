import React, { useState } from 'react';

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
  ListItemText,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Select, {
  components,
  GroupBase,
  StylesConfig,
  OptionProps as RSOptionProps,
  DropdownIndicatorProps as RSDropdownIndicatorProps,
} from 'react-select';
import { P, match } from 'ts-pattern';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useConfig } from '#/src/config';
import { localizeIfNimiObject, translateRajainItem } from '#/src/tools/localization';
import { TODOType } from '#/src/types/common';
import { RajainItem, isCheckboxRajainId } from '#/src/types/SuodatinTypes';

import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from './CustomizedMuiComponents';
import { isIndeterminate } from './isIndeterminate';
import { SummaryContent } from './SummaryContent';
import { KonfoCheckbox } from '../KonfoCheckbox';
import { LabelTooltip } from '../LabelTooltip';

const HIDE_NOT_EXPANDED_AMOUNT = 5;

type OptionType = {
  label: string;
  checked?: boolean;
  id?: string;
};

type OptionsType = Array<OptionType>;

type Styles = StylesConfig<OptionType, false, GroupBase<OptionType>>;
const customStyles: Styles = {
  control: (provided) => ({
    ...provided,
    minHeight: '34px',
    borderRadius: '2px',
    cursor: 'text',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: colors.grey700,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: colors.grey700,
    '&:hover': {
      color: colors.green900,
    },
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
    <MaterialIcon icon="search" />
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

const checkboxValuePattern = {
  count: P.number,
  id: P.string,
  nimi: P.optional(P._),
  checked: P.boolean,
};

const alakoodit = (rajainItem: RajainItem) =>
  match(rajainItem)
    .with(
      {
        alakoodit: P.select(
          P.array({ ...checkboxValuePattern, rajainId: P.when(isCheckboxRajainId) })
        ),
      },
      (koodit) =>
        koodit.map((alakoodi) => ({
          count: alakoodi.count,
          rajainId: alakoodi.rajainId,
          id: alakoodi.id,
          nimi: alakoodi.nimi,
          checked: alakoodi.checked,
        }))
    )
    .otherwise(() => []);

type CheckboxProps = {
  value: RajainItem;
  isCountVisible?: boolean;
  onChange: (v: RajainItem) => void;
  indented?: boolean;
  expandButton?: React.JSX.Element;
  disabled?: boolean;
  additionalInfo?: string;
};

const useTooltipDefaultTranslation = (id: string) => {
  const { t, i18n } = useTranslation();
  const translationKey = `haku.${id}-tooltip`;
  return i18n.exists(translationKey) ? t(translationKey) : null;
};

export const FilterCheckbox = ({
  onChange,
  indented,
  isCountVisible,
  value,
  expandButton,
  disabled,
  additionalInfo,
}: CheckboxProps) => {
  const { count, id, checked } = match(value)
    .with(checkboxValuePattern, (v) => ({
      count: v.count,
      id: v.id,
      checked: v.checked,
    }))
    .run();

  const labelId = `filter-list-label-${id}`;

  const { t } = useTranslation();

  const defaultTooltipText = useTooltipDefaultTranslation(id);
  const tooltipText = additionalInfo ?? defaultTooltipText;

  return (
    <ListItem key={id} disablePadding>
      <ListItemButton
        dense
        disableGutters
        onClick={() => onChange(value)}
        disabled={disabled}
        sx={{
          marginLeft: indented ? 2 : 0,
          paddingLeft: '2px',
          paddingRight: '2px',
          '&:focus-visible': {
            boxShadow: `0 0 0 2px ${colors.grey700}`,
          },
        }}>
        <ListItemIcon>
          <KonfoCheckbox
            edge="start"
            checked={checked}
            indeterminateIcon={
              <MaterialIcon variant="outlined" icon="indeterminate_check_box" />
            }
            indeterminate={isIndeterminate(value)}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          sx={{ wordWrap: 'break-word' }}
          primaryTypographyProps={{ variant: 'body2' }}
          primary={translateRajainItem(value, t)}
        />
        {tooltipText && (
          <Box paddingLeft={1}>
            <LabelTooltip title={tooltipText} />
          </Box>
        )}
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
  onChange,
  value,
}: {
  defaultExpandAlakoodit: boolean;
  onChange: (v: RajainItem) => void;
  value: RajainItem;
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
        onChange={onChange}
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
            <MaterialIcon icon={isOpen ? 'expand_less' : 'expand_more'} />
          </IconButton>
        }
      />
      {isOpen &&
        alakoodit(value).map((v) => (
          <FilterCheckbox
            key={v.id}
            value={{ ...v }}
            onChange={onChange}
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
  onFocus?: () => void;
  onHide?: () => void;
  rajainItems: Array<RajainItem>;
  onItemChange: (value: TODOType) => void;
  options?: OptionsType;
  optionsLoading?: boolean;
  selectPlaceholder?: string;
  additionalContent?: React.JSX.Element;
  isCountVisible?: boolean;
};

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
  rajainItems,
  onItemChange,
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
  const usedName = [name, rajainItems.length === 0 && '(0)'].filter(Boolean).join(' ');

  const config = useConfig();
  const isCountVisible = isCountVisibleProp && config?.naytaFiltterienHakutulosLuvut;

  return (
    <SuodatinAccordion
      disabled={rajainItems.length === 0}
      data-testid={testId}
      elevation={elevation}
      defaultExpanded={expanded}
      square>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<MaterialIcon icon="expand_more" />}>
          <SummaryContent
            filterName={usedName}
            values={rajainItems}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column" wrap="nowrap">
          {additionalContent}
          {options && rajainItems.length > HIDE_NOT_EXPANDED_AMOUNT && (
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
                onChange={(item) => {
                  if (item) {
                    onItemChange(item);
                  }
                }}
                onFocus={onFocus}
                onMenuClose={onHide}
                onMenuOpen={onFocus}
                blurInputOnSelect
                onBlur={onHide}
                theme={(theme) => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: colors.grey700,
                    primary: colors.brandGreen,
                  },
                })}
              />
            </Grid>
          )}
          <Grid item>
            <List style={{ width: '100%' }}>
              {rajainItems
                .filter((v) =>
                  match(v)
                    .with(
                      { checked: P.boolean, hidden: P.optional(P.not(true)) },
                      () => true
                    )
                    .otherwise(() => false)
                )
                .map((value, i) => {
                  if (expandValues && hideRest && i >= HIDE_NOT_EXPANDED_AMOUNT) {
                    return null;
                  }

                  return alakoodit(value).length > 0 ? (
                    <FilterCheckboxGroup
                      key={value.id}
                      defaultExpandAlakoodit={defaultExpandAlakoodit}
                      value={value}
                      onChange={onItemChange}
                      isCountVisible={isCountVisible}
                    />
                  ) : (
                    <FilterCheckbox
                      key={value.id}
                      value={value}
                      onChange={onItemChange}
                      isCountVisible={isCountVisible}
                    />
                  );
                })}
            </List>
          </Grid>
          {expandValues && rajainItems.length > HIDE_NOT_EXPANDED_AMOUNT && (
            <Button
              color="secondary"
              size="small"
              sx={{
                fontSize: 14,
                border: '1px solid red',
              }}
              endIcon={<MaterialIcon icon={hideRest ? 'expand_more' : 'expand_less'} />}
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
