import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import { getFilterStateChanges } from '#/src/tools/filters';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const hakukaynnissaValues = props.hakukaynnissaValues!;
  const hakutapaValues = props.hakutapaValues!;

  const filterValues = useMemo(() => {
    if (hakutapaValues?.length === 0) {
      return []; // Piilota hakukaynnissa -rajain jos muita arvoja ei ole löytynyt
    }

    return [...hakukaynnissaValues, ...hakutapaValues];
  }, [hakukaynnissaValues, hakutapaValues]);

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      props.setFilters({ hakukaynnissa: !item.checked });
    } else {
      const changes = getFilterStateChanges(hakutapaValues)(item);
      props.setFilters(changes);
    }
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      values={filterValues}
      handleCheck={handleCheck}
      displaySelected
    />
  );
};
