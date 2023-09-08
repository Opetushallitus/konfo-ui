import { isUndefined } from 'lodash';

import { Rajain } from './Kysymys';

export const getChangedRajaimet = (
  selectedRajainValues: Rajain,
  rajainId: string,
  rajainValue: string
) => {
  const rajainValues = selectedRajainValues[rajainId] as Array<string>;
  if (isUndefined(rajainValues)) {
    return { ...selectedRajainValues, [rajainId]: [rajainValue] };
  } else {
    const updatedSelected = rajainValues.includes(rajainValue)
      ? rajainValues.filter((v: string) => v !== rajainValue)
      : [...rajainValues, rajainValue];
    return { ...selectedRajainValues, [rajainId]: updatedSelected };
  }
};
