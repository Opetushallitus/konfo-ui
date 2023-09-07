import { useCallback } from 'react';

import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainItem, SetRajainValues } from '#/src/types/SuodatinTypes';

export const useCheckboxRajainOnChange = (
  rajainItems: Array<RajainItem>,
  setRajainValues: SetRajainValues
) =>
  useCallback(
    (item: RajainItem) => {
      setRajainValues(getStateChangesForCheckboxRajaimet(rajainItems)(item));
    },
    [rajainItems, setRajainValues]
  );
