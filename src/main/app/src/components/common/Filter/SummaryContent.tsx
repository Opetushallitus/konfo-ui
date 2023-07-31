import React, { useMemo } from 'react';

import { Grid, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { inRange, size, flatten } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';
import { RajainUIItem } from '#/src/types/SuodatinTypes';

import { SuodatinMobileChip } from './CustomizedMuiComponents';

const MAX_CHARS_BEFORE_CHIP_TO_NUMBER = 24;

type Props = {
  filterName: ReturnType<TFunction>;
  values?: Array<RajainUIItem>;
  contentString?: string;
  numberOfItems?: number;
  displaySelected?: boolean;
};

const stringTooLongForChip = (name: string) =>
  !inRange(size(name), 0, MAX_CHARS_BEFORE_CHIP_TO_NUMBER);

export const SummaryContent = ({
  filterName,
  values,
  contentString,
  numberOfItems,
  displaySelected,
}: Props) => {
  const { t } = useTranslation();
  const selectedValues = useMemo(
    () =>
      flatten(values?.map((v: RajainUIItem) => [v, ...(v.alakoodit || [])])).filter(
        (v: RajainUIItem) => v.checked
      ),
    [values]
  );
  const selectedFiltersStr =
    contentString ||
    selectedValues
      .map((v) => localize(v) || t(`haku.${v.id}`)) // Kaikille suodattimille ei tule backendista käännöksiä
      .join(', ');

  const chipLabel = numberOfItems || selectedValues.length;
  return (
    <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
      <Grid item style={{ paddingRight: '8px' }}>
        <Typography variant="subtitle1">{filterName}</Typography>
      </Grid>
      {displaySelected && (
        <Grid item>
          {stringTooLongForChip(selectedFiltersStr) ? (
            <SuodatinMobileChip label={chipLabel} />
          ) : (
            selectedFiltersStr
          )}
        </Grid>
      )}
    </Grid>
  );
};
