import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import { RajainItem } from '#/src/types/SuodatinTypes';

export const useCheckboxRajainOnChange =
  (
    rajainItems: Array<RajainItem>,
    setFilters: (rajainValues: Record<string, Array<string>>) => void
  ) =>
  (item: RajainItem) => {
    const changes = getStateChangesForCheckboxRajaimet(rajainItems)(item);
    setFilters(changes);
  };
