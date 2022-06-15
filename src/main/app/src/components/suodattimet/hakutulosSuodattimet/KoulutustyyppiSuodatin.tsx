import React, { useMemo, useState } from 'react';

import { Button, ButtonGroup, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../../haku/hakutulosHooks';

const withStyles = makeStyles(() => ({
  noBoxShadow: {
    boxShadow: 'none',
  },
  buttonRoot: {
    fontSize: 14,
    fontWeight: 600,
    padding: '5px',
  },
  buttonLabelTruncated: {
    overflow: 'hidden',
    display: 'block',
    textOverflow: 'ellipsis',
  },
  buttonActive: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    '&:hover': {
      backgroundColor: colors.brandGreen,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.brandGreen,
  },
}));

export const KoulutustyyppiSuodatin = (props: SuodatinComponentProps) => {
  const classes = withStyles();
  const { t } = useTranslation();

  const [isMuuSelected, setIsMuuSelected] = useState(false);
  const values = useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI);
  const muuValues = useFilterProps(FILTER_TYPES.KOULUTUSTYYPPI_MUU);

  const filterValues = useMemo(
    () => [
      ...values.map((v) => ({ ...v, hidden: isMuuSelected })),
      ...muuValues.map((v) => ({ ...v, hidden: !isMuuSelected })),
    ],
    [isMuuSelected, muuValues, values]
  );

  const getChanges = getFilterStateChanges(isMuuSelected ? muuValues : values);
  const handleCheck = (item: FilterValue) => {
    const changes = getChanges(item);
    props.setFilters(changes);
  };

  return (
    <Filter
      defaultExpandAlakoodit={true}
      {...props}
      testId="koulutustyyppi-filter"
      name={t('haku.koulutustyyppi')}
      values={filterValues}
      handleCheck={handleCheck}
      additionalContent={
        <Grid item style={{ padding: '20px 0' }}>
          {/* TODO erillinen common component tästä */}
          <ButtonGroup fullWidth>
            <Button
              style={{ minWidth: '155px' }}
              className={!isMuuSelected ? classes.buttonActive : classes.buttonInactive}
              classes={{ root: classes.buttonRoot, label: classes.buttonLabelTruncated }}
              aria-selected={!isMuuSelected}
              onClick={() => setIsMuuSelected(false)}>
              {t('haku.tutkintoon-johtavat')}
            </Button>
            <Button
              className={isMuuSelected ? classes.buttonActive : classes.buttonInactive}
              classes={{ root: classes.buttonRoot, label: classes.buttonLabelTruncated }}
              aria-selected={isMuuSelected}
              onClick={() => setIsMuuSelected(true)}>
              {t('haku.muut')}
            </Button>
          </ButtonGroup>
        </Grid>
      }
    />
  );
};
