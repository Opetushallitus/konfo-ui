import { omit, mapValues, forEach } from 'lodash';
import { P, match } from 'ts-pattern';

import { isNumberRangeRajainId } from '#/src/types/SuodatinTypes';

export const createRajainQueryParams = (
  values: Record<string, Array<string> | boolean | Record<string, number>>
) => {
  const numberValueKeys = Object.keys(values).filter((k) => isNumberRangeRajainId(k));
  const nonZeroNumberValues: Record<string, number> = {};
  forEach(numberValueKeys, (k) => {
    // Tässä kohdassa tiedetään varmuudella että arvo on numero (minmax) objekti
    const numberObject = values[k] as Record<string, number>;
    for (const subKey in numberObject) {
      const v = numberObject[subKey];
      if (v > 0) {
        nonZeroNumberValues[subKey] = v;
      }
    }
  });
  const valuesWithoutZeros = {
    ...omit(values, numberValueKeys),
    ...nonZeroNumberValues,
  };
  // TODO: konfo-backend haluaa maakunta ja kunta -rajainten sijaan "sijainti" -rajaimen, pitäisi refaktoroida sinne maakunta + kunta käyttöön
  const valuesWithSijainti = omit(
    {
      ...valuesWithoutZeros,
      sijainti: [
        ...((values.maakunta as Array<string>) ?? []),
        ...((values.kunta as Array<string>) ?? []),
      ],
    },
    ['maakunta', 'kunta', 'koulutusala', 'koulutustyyppi-muu']
  );
  return mapValues(valuesWithSijainti, (v) =>
    match(v)
      .with(P.array(P.string), (arr) => arr.join(','))
      .otherwise(() => v!.toString())
  );
};
