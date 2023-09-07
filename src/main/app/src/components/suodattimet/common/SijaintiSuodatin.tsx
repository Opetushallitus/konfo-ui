import React, { useMemo } from 'react';

import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { RAJAIN_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet, useRajainItems } from '#/src/tools/filters';
import { localize } from '#/src/tools/localization';
import {
  CheckboxRajainItem,
  RajainItem,
  RajainComponentProps,
} from '#/src/types/SuodatinTypes';

import { useSearch } from '../../haku/hakutulosHooks';

export const SijaintiSuodatin = (props: RajainComponentProps) => {
  const { t } = useTranslation();
  const { rajainValues, rajainOptions, setRajainValues, loading } = props;

  const kuntaRajainValues = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.KUNTA
  ) as Array<CheckboxRajainItem>;

  const maakuntaRajainValues = useRajainItems(
    rajainOptions,
    rajainValues,
    RAJAIN_TYPES.MAAKUNTA
  ) as Array<CheckboxRajainItem>;

  const onItemChange = (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(
      kuntaRajainValues.concat(maakuntaRajainValues)
    )(item);
    setRajainValues(changes);
  };

  const { isFetching } = useSearch();

  const optionsLoading = isFetching;

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const groupedSijainnit = useMemo(() => {
    const getSelectOption = (value: CheckboxRajainItem, isMaakunta: boolean) => ({
      ...value,
      label: naytaFiltterienHakutulosLuvut
        ? `${localize(value)} (${value.count})`
        : localize(value),
      value: localize(value),
      isMaakunta,
      name: value.nimi,
    });

    return [
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: sortBy(kuntaRajainValues.map((v) => getSelectOption(v, false), 'label')),
      },
      {
        label: t('haku.maakunnat'),
        options: sortBy(
          maakuntaRajainValues.map((v) => getSelectOption(v, true)),
          'label'
        ),
      },
    ];
  }, [kuntaRajainValues, maakuntaRajainValues, t, naytaFiltterienHakutulosLuvut]);

  const usedRajainValues = useMemo(
    () =>
      maakuntaRajainValues
        .concat(
          kuntaRajainValues.filter((k) => k.checked).map((v) => ({ ...v, hidden: false }))
        )
        .sort((a, b) => Number(b.checked) - Number(a.checked)),
    [maakuntaRajainValues, kuntaRajainValues]
  );

  return (
    <Filter
      {...props}
      options={groupedSijainnit}
      optionsLoading={optionsLoading || loading}
      selectPlaceholder={t('haku.etsi-paikkakunta-tai-alue')}
      name={t('haku.sijainti')}
      rajainItems={usedRajainValues}
      onItemChange={onItemChange}
      expandValues
      displaySelected
    />
  );
};
