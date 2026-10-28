import React, { useMemo } from 'react';

import { sortBy } from 'lodash';

import { Filter } from '#/src/components/common/Filter';
import { useConfig } from '#/src/config';
import { RAJAIN_TYPES } from '#/src/constants';
import { useRajainItems } from '#/src/tools/filters';
import { getLanguage, localize } from '#/src/tools/localization';
import { CheckboxRajainItem, RajainComponentProps } from '#/src/types/SuodatinTypes';

import { useCheckboxRajainOnChange } from './useCheckboxRajainOnChange';

type Props = RajainComponentProps & {
  rajainId: typeof RAJAIN_TYPES.OPPILAITOS | typeof RAJAIN_TYPES.TOIMIPISTE;
  name: string;
  selectLabel: string;
  selectPlaceholder: string;
};

// Organisaatiorajain (oppilaitos tai toimipiste), jossa on hakukenttä. Organisaatiot voivat olla
// kaksitasoisena hierarkiana, jolloin alemmat organisaatiot ovat ylemmän alakoodeina.
export const OrganisaatioSuodatin = (props: Props) => {
  const {
    setRajainValues,
    rajainOptions,
    rajainValues,
    rajainId,
    name,
    selectLabel,
    selectPlaceholder,
    ...rest
  } = props;

  const rajainItems = useRajainItems(rajainOptions, rajainValues, rajainId);

  const onItemChange = useCheckboxRajainOnChange(rajainItems, setRajainValues);

  const config = useConfig();
  const naytaFiltterienHakutulosLuvut = config.naytaFiltterienHakutulosLuvut;

  const language = getLanguage();

  const usedRajainItems = useMemo(() => {
    const byCheckedAndName = (a: CheckboxRajainItem, b: CheckboxRajainItem) =>
      Number(b.checked) - Number(a.checked) ||
      localize(a.nimi).localeCompare(localize(b.nimi), language);

    return (rajainItems as Array<CheckboxRajainItem>)
      .map((item) =>
        item.alakoodit
          ? { ...item, alakoodit: [...item.alakoodit].sort(byCheckedAndName) }
          : item
      )
      .sort(byCheckedAndName);
  }, [rajainItems, language]);

  const options = useMemo(() => {
    const getSelectOption = (value: CheckboxRajainItem) => ({
      ...value,
      label: naytaFiltterienHakutulosLuvut
        ? `${localize(value)} (${value.count})`
        : localize(value),
      value: localize(value),
      name: value.nimi,
    });

    // Haettavissa ovat myös alemmat organisaatiot
    const allItems = usedRajainItems.flatMap((v) => [v, ...(v.alakoodit ?? [])]);

    return [
      {
        label: name,
        options: sortBy(
          allItems.map((v) => getSelectOption(v)),
          'label'
        ),
      },
    ];
  }, [usedRajainItems, name, naytaFiltterienHakutulosLuvut]);

  return (
    <Filter
      {...rest}
      name={name}
      selectLabel={selectLabel}
      selectPlaceholder={selectPlaceholder}
      rajainItems={usedRajainItems}
      onItemChange={onItemChange}
      options={options}
      expandValues
      displaySelected
    />
  );
};
