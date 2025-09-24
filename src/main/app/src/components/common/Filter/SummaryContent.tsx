import React, { useMemo } from 'react';

import { Grid, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { inRange, size } from 'lodash';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { translateRajainItem } from '#/src/tools/localization';
import { RajainItem } from '#/src/types/SuodatinTypes';

import { SuodatinMobileChip } from './CustomizedMuiComponents';

const MAX_CHARS_BEFORE_CHIP_TO_NUMBER = 24;

type Props = {
  filterName: ReturnType<TFunction>;
  values?: Array<RajainItem>;
  contentString?: string;
  numberOfItems?: number;
  displaySelected?: boolean;
};

const stringTooLongForChip = (name: string) =>
  !inRange(size(name), 0, MAX_CHARS_BEFORE_CHIP_TO_NUMBER);

const contentPattern = { checked: true, id: P.string, nimi: P.optional(P._) };

const pickValues = (rajainItems: Array<RajainItem>) => {
  const checkedAlakoodit = rajainItems.flatMap((v) =>
    match(v)
      .with({ alakoodit: P.select(P.array(contentPattern)) }, (koodit) => koodit)
      .otherwise(() => [])
  );
  return [
    ...checkedAlakoodit,
    rajainItems.filter((v) =>
      match(v)
        .with(contentPattern, () => true)
        .otherwise(() => false)
    ),
  ].flat();
};

export const SummaryContent = ({
  filterName,
  values,
  contentString,
  numberOfItems,
  displaySelected,
}: Props) => {
  const { t } = useTranslation();
  const selectedValues = useMemo(() => pickValues(values || []), [values]);
  const selectedFiltersStr =
    contentString || selectedValues.map((v) => translateRajainItem(v, t)).join(', ');

  const chipLabel = numberOfItems || selectedValues.length;
  return (
    <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
      <Grid item style={{ paddingRight: '8px' }}>
        <Typography variant="subtitle1" component="span">
          {filterName}
        </Typography>
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
