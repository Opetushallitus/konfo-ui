  import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { useFilterProps, useSearch } from '../haku/hakutulosHooks';

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const { setFilters } = useSearch();

  const hakukaynnissaValues = useFilterProps(FILTER_TYPES.HAKUKAYNNISSA);
  const hakutapaValues = useFilterProps(FILTER_TYPES.HAKUTAPA);

  const filterValues = useMemo(() => {
    if (hakutapaValues?.length === 0) {
      return []; // Piilota hakukaynnissa -rajain jos muita arvoja ei ole löytynyt
    }

    return [...hakukaynnissaValues, ...hakutapaValues];
  }, [hakukaynnissaValues, hakutapaValues]);

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      setFilters({ hakukaynnissa: !item.checked });
    } else {
      const changes = getFilterStateChanges(hakutapaValues)(item);
      setFilters(changes);
    }
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      values={props.isHaku ? filterValues : props.values!}
      handleCheck={props.isHaku ? handleCheck : props.handleFilterChange!}
      displaySelected
    />
  );
};
