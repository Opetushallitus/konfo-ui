import React, { useMemo } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import { TFunction } from 'i18next';
import { ceil, range, isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet } from '#/src/tools/filters';
import {
  SuodatinComponentProps,
  NumberRangeRajainItem,
  RajainUIItem,
  RajainItem,
} from '#/src/types/SuodatinTypes';

import { FilterCheckbox } from '../../common/Filter';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '../../common/Filter/CustomizedMuiComponents';
import { NumberRangeSlider } from '../../common/Filter/NumberRangeSlider';
import { SummaryContent } from '../../common/Filter/SummaryContent';

const MAX_NUMBER_OF_SLIDER_MARKS = 5;
const ALLOWED_SLIDER_MARKS = [1, 2, 2.5, 5];
const DEFAULT_UPPERLIMIT_MAKSULLINEN = 10000;
const DEFAULT_UPPERLIMIT_LUKUVUOSIMAKSU = 20000;

const resolveSliderMarks = (upperLimit: number) => {
  let multiplier = 1;
  let stepLength = undefined;
  // Haetaan sallittujen slider-merkkien listalta sellainen arvo, jolla upperlimit voidaan jakaa
  // niin että merkkejä tulee <= merkkien sallittu maksimiarvo.
  // Listan arvot kerrotaan jokaisella hakukierroksella kerroin-arvolla (multiplier), joka alkaa yhdestä ja
  // kerrotaan jokaisella uudella kierroksella kymmenellä.
  // Hakukierroksia suoritetaan kunnes sopiva arvo löydetään.
  while (!stepLength) {
    stepLength = ALLOWED_SLIDER_MARKS.find(
      (v) => ceil(upperLimit / (v * multiplier)) <= MAX_NUMBER_OF_SLIDER_MARKS
    );
    multiplier = stepLength ? multiplier : multiplier * 10;
  }
  stepLength = stepLength * multiplier;
  const remainder = upperLimit % stepLength;
  return remainder > 0
    ? range(0, upperLimit, stepLength).concat([upperLimit])
    : range(0, upperLimit + 1, stepLength);
};

const marks = (upperLimit: number) => {
  const valueSeq = resolveSliderMarks(upperLimit);
  const marx = valueSeq.map((val) => ({ value: val, label: `${val}€` }));
  marx[0].label = '';
  return marx;
};

const checkboxRajain = (rajainValues: Array<RajainItem>, id: string): RajainUIItem =>
  (rajainValues.find((r) => r.id === id) || {
    rajainId: 'maksullisuustyyppi',
    id,
    count: 0,
    checked: false,
  }) as RajainUIItem;

const getNumberRangeRajain = (rajainValues: Array<RajainItem>, rajainId: string) =>
  (rajainValues.find((r) => r.rajainId === rajainId) || {
    rajainId,
    id: rajainId,
    count: 0,
  }) as NumberRangeRajainItem;

type NumberRangeValues = {
  undefinedValue: Array<number>;
  numberRangeValues: Array<number>;
};

const numberRangeValues = (
  numberRangeRajain: NumberRangeRajainItem,
  defaultUpperLimit: number
): NumberRangeValues => {
  const undefinedValue = [0, numberRangeRajain?.upperLimit || defaultUpperLimit];
  return {
    undefinedValue,
    numberRangeValues: [
      numberRangeRajain?.min || undefinedValue[0],
      numberRangeRajain?.max || undefinedValue[1],
    ],
  };
};
const labelText = (val: number) => (val > 0 ? `${val}€` : '0');
const rangeText = (vals: Array<number>) =>
  ` ${labelText(vals[0])} - ${labelText(vals[1])}`;

const rangeRajainObject = (rajainName: string, rajainvValues: Array<number>) => ({
  [rajainName]: {
    [`${rajainName}_min`]: rajainvValues[0],
    [`${rajainName}_max`]: rajainvValues[1],
  },
});

const maksullisuustyyppiSetDisabled = (
  rajainValues: Array<RajainItem>,
  newRajainValues: Array<string>,
  tyyppi: string
) => checkboxRajain(rajainValues, tyyppi).checked && !newRajainValues.includes(tyyppi);

const maksullisuustyyppiRajainItems = (rajainValues: Array<RajainItem>) =>
  ['maksuton', 'maksullinen', 'lukuvuosimaksu'].map((tyyppi) =>
    checkboxRajain(rajainValues, tyyppi)
  );

const headerContent = (
  rajainValues: Array<RajainItem>,
  maksunmaara: NumberRangeValues,
  lukuvuosimaksu: NumberRangeValues,
  t: TFunction
) => {
  const selectedRajainItems = maksullisuustyyppiRajainItems(rajainValues).filter(
    (v) => v.checked
  );
  const contentString = selectedRajainItems
    .map((item) => {
      let addInfo =
        item.id === 'maksullinen'
          ? isEqual(maksunmaara.numberRangeValues, maksunmaara.undefinedValue)
            ? ''
            : rangeText(maksunmaara.numberRangeValues)
          : '';
      addInfo =
        item.id === 'lukuvuosimaksu'
          ? isEqual(lukuvuosimaksu.numberRangeValues, lukuvuosimaksu.undefinedValue)
            ? ''
            : rangeText(lukuvuosimaksu.numberRangeValues)
          : addInfo;
      addInfo =
        item.id === 'lukuvuosimaksu' && checkboxRajain(rajainValues, 'apuraha').checked
          ? `${addInfo} + ${t('haku.apuraha')}`
          : addInfo;
      return `${t(`haku.${item.id}`)}${addInfo}`;
    })
    .join(',');
  return { contentString, numberOfItems: selectedRajainItems.length };
};

const maksullisuustyyppiChanges = (
  rajainValues: Array<RajainItem>,
  rajainItem: RajainUIItem
) => {
  let changes = getStateChangesForCheckboxRajaimet(
    maksullisuustyyppiRajainItems(rajainValues)
  )(rajainItem);
  if (
    maksullisuustyyppiSetDisabled(rajainValues, changes.maksullisuustyyppi, 'maksullinen')
  ) {
    changes = Object.assign(changes, rangeRajainObject('maksunmaara', [0, 0]));
  }
  if (
    maksullisuustyyppiSetDisabled(
      rajainValues,
      changes.maksullisuustyyppi,
      'lukuvuosimaksu'
    )
  ) {
    changes = Object.assign(changes, rangeRajainObject('lukuvuosimaksunmaara', [0, 0]), {
      apuraha: false,
    });
  }
  return changes;
};

export const MaksullisuusSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainValues = [],
  setFilters,
}: SuodatinComponentProps) => {
  const { t } = useTranslation();

  const config = useConfig();
  const isCountVisible = config?.naytaFiltterienHakutulosLuvut;

  const setMaksuRange = (maksuRange: Array<number>) =>
    setFilters(
      isEqual(maksuRange, undefinedMaksunmaara)
        ? rangeRajainObject('maksunmaara', [0, 0])
        : rangeRajainObject('maksunmaara', maksuRange)
    );
  const setLukuvuosiMaksuRange = (maksuRange: Array<number>) =>
    setFilters(
      isEqual(maksuRange, undefinedLukuvuosimaksu)
        ? rangeRajainObject('lukuvuosimaksunmaara', [0, 0])
        : rangeRajainObject('lukuvuosimaksunmaara', maksuRange)
    );

  const handleMaksullisuustyyppiCheck = (item: RajainUIItem) =>
    setFilters(maksullisuustyyppiChanges(rajainValues, item));

  const maksunmaaraValues = useMemo(
    () =>
      numberRangeValues(
        getNumberRangeRajain(rajainValues, FILTER_TYPES.MAKSUNMAARA),
        DEFAULT_UPPERLIMIT_MAKSULLINEN
      ),
    [rajainValues]
  );
  const undefinedMaksunmaara = maksunmaaraValues.undefinedValue;
  const maksunmaaraRangeValues = maksunmaaraValues.numberRangeValues;

  const lukuvuosimaksuValues = useMemo(
    () =>
      numberRangeValues(
        getNumberRangeRajain(rajainValues, FILTER_TYPES.LUKUVUOSIMAKSUNMAARA),
        DEFAULT_UPPERLIMIT_LUKUVUOSIMAKSU
      ),
    [rajainValues]
  );
  const undefinedLukuvuosimaksu = lukuvuosimaksuValues.undefinedValue;
  const lukuvuosimaksuRangeValues = lukuvuosimaksuValues.numberRangeValues;

  const summary = useMemo(
    () => headerContent(rajainValues, maksunmaaraValues, lukuvuosimaksuValues, t),
    [lukuvuosimaksuValues, maksunmaaraValues, rajainValues, t]
  );

  return (
    <SuodatinAccordion elevation={elevation} defaultExpanded={expanded} square>
      {!summaryHidden && (
        <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
          <SummaryContent
            filterName={t('haku.maksullisuus')}
            contentString={summary.contentString}
            numberOfItems={summary.numberOfItems}
            displaySelected={displaySelected}
          />
        </SuodatinAccordionSummary>
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <Grid container direction="column" wrap="nowrap">
          <Grid item>
            <List style={{ width: '100%' }}>
              <FilterCheckbox
                value={checkboxRajain(rajainValues, 'maksuton')}
                handleCheck={handleMaksullisuustyyppiCheck}
                isCountVisible={isCountVisible}
              />
              <FilterCheckbox
                value={checkboxRajain(rajainValues, 'maksullinen')}
                handleCheck={handleMaksullisuustyyppiCheck}
                isCountVisible={isCountVisible}
              />
              <NumberRangeSlider
                values={maksunmaaraRangeValues}
                min={undefinedMaksunmaara[0]}
                max={undefinedMaksunmaara[1]}
                marks={marks(undefinedMaksunmaara[1])}
                labelFormatter={labelText}
                onRangeCommit={setMaksuRange}
                disabled={!checkboxRajain(rajainValues, 'maksullinen').checked}
              />
              <FilterCheckbox
                value={checkboxRajain(rajainValues, 'lukuvuosimaksu')}
                handleCheck={handleMaksullisuustyyppiCheck}
                isCountVisible={isCountVisible}
              />
              <NumberRangeSlider
                values={lukuvuosimaksuRangeValues}
                min={undefinedLukuvuosimaksu[0]}
                max={undefinedLukuvuosimaksu[1]}
                marks={marks(undefinedLukuvuosimaksu[1])}
                labelFormatter={labelText}
                onRangeCommit={setLukuvuosiMaksuRange}
                disabled={!checkboxRajain(rajainValues, 'lukuvuosimaksu').checked}
              />
              <FilterCheckbox
                key={FILTER_TYPES.APURAHA}
                value={checkboxRajain(rajainValues, 'apuraha')}
                handleCheck={(item: RajainUIItem) =>
                  setFilters({
                    apuraha: !item.checked,
                  })
                }
                isCountVisible={false}
                disabled={!checkboxRajain(rajainValues, 'lukuvuosimaksu').checked}
              />
            </List>
          </Grid>
        </Grid>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
