import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import {
  setFilterSelectedValues,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { getFilterStateChanges } from '#/src/tools/filters';
import {
  FilterValues,
  FilterValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

const hakukaynnissaSelector = getFilterProps(FILTER_TYPES.HAKUKAYNNISSA);
const hakutapaFilterSelector = getFilterProps(FILTER_TYPES.HAKUTAPA);

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hakukaynnissaValues = useSelector<any, FilterValues>(hakukaynnissaSelector);
  const hakutapaValues = useSelector<any, FilterValues>(hakutapaFilterSelector);

  const filterValues = useMemo(() => {
    if (hakutapaValues?.length === 0) {
      return []; // Piilota hakukaynnissa -rajain jos muita arvoja ei ole löytynyt
    }

    return [...hakukaynnissaValues, ...hakutapaValues];
  }, [hakukaynnissaValues, hakutapaValues]);

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      dispatch(setFilterSelectedValues({ hakukaynnissa: !item.checked }));
    } else {
      const changes = getFilterStateChanges(hakutapaValues)(item);
      dispatch(setFilterSelectedValues(changes));
    }
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      values={filterValues}
      handleCheck={handleCheck}
    />
  );
};
