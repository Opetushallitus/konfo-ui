import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { FilterValue, SuodatinComponentProps } from '#/src/types/SuodatinTypes';

import { getSelectOption } from '../../common/utils';

type Props = {
  handleFilterChange: (value: FilterValue) => void;
  maakuntaValues: Array<FilterValue>;
  kuntaValues: Array<FilterValue>;
  loading: boolean;
} & SuodatinComponentProps;

export const SijaintiSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const {
    handleFilterChange,
    loading,
    maakuntaValues = [],
    kuntaValues = [],
    ...rest
  } = props;

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.maakunnat'),
        options: _fp.sortBy('label')(maakuntaValues.map((v) => getSelectOption(v, true))),
      },
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: _fp.sortBy('label')(kuntaValues.map((v) => getSelectOption(v, false))),
      },
    ],
    [kuntaValues, maakuntaValues, t]
  );

  const usedValues = useMemo(
    () => maakuntaValues.concat(kuntaValues.map((v) => ({ ...v, hidden: true }))),
    [maakuntaValues, kuntaValues]
  );

  return (
    <Filter
      options={groupedSijainnit}
      optionsLoading={loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={handleFilterChange}
      displaySelected
      {...rest}
    />
  );
};
