import React, { useMemo } from 'react';

import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import List from '@mui/material/List';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { FilterCheckbox } from '#/src/components/common/Filter';
import {
  SuodatinAccordion,
  SuodatinAccordionDetails,
  SuodatinAccordionSummary,
} from '#/src/components/common/Filter/CustomizedMuiComponents';
import { NumberRangeSlider } from '#/src/components/common/Filter/NumberRangeSlider';
import { SummaryContent } from '#/src/components/common/Filter/SummaryContent';
import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import { getStateChangesForCheckboxRajaimet, isChecked } from '#/src/tools/filters';
import {
  SuodatinComponentProps,
  RajainItem,
  NumberRangeRajainId,
} from '#/src/types/SuodatinTypes';

import { marks } from './maksullisuusRajainUtils';

type MaksunMaaraRajainName = 'maksunmaara' | 'lukuvuosimaksunmaara';

const getCheckboxRajain = (rajainValues: Array<RajainItem>, id: string): RajainItem =>
  rajainValues.find((r) => r.id === id) ?? {
    rajainId: 'maksullisuustyyppi',
    id,
    count: 0,
    checked: false,
  };

const getNumberRangeRajain = (
  rajainValues: Array<RajainItem>,
  rajainId: NumberRangeRajainId
) =>
  rajainValues?.find((r) => r.rajainId === rajainId) ?? {
    rajainId,
    id: rajainId,
    count: 0,
  };

type NumberRangeValues = {
  undefinedValue: Array<number>;
  numberRangeValues: Array<number>;
};

const getNumberRangeValues = (
  numberRangeRajain: RajainItem,
  defaultUpperLimit: number = 0
): NumberRangeValues => {
  const { upperLimit, min, max } = match(numberRangeRajain)
    .with(
      {
        upperLimit: P.optional(P.number),
        min: P.optional(P.number),
        max: P.optional(P.number),
      },
      (v) => ({
        upperLimit: v.upperLimit,
        min: v.min,
        max: v.max,
      })
    )
    .run();
  const undefinedValue = [0, upperLimit ?? defaultUpperLimit];
  return {
    undefinedValue,
    numberRangeValues: [min || undefinedValue[0], max || undefinedValue[1]],
  };
};

const rangeRajainObject = (rajainName: string, rajainValues: Array<number>) => ({
  [rajainName]: {
    [`${rajainName}_min`]: rajainValues[0],
    [`${rajainName}_max`]: rajainValues[1],
  },
});

const maksullisuustyyppiSetDisabled = (
  rajainValues: Array<RajainItem>,
  newRajainValues: Array<string>,
  tyyppi: string
) =>
  isChecked(getCheckboxRajain(rajainValues, tyyppi)) && !newRajainValues.includes(tyyppi);

const maksullisuustyyppiRajainItems = (rajainValues: Array<RajainItem>) =>
  ['maksuton', 'maksullinen', 'lukuvuosimaksu'].map((tyyppi) =>
    getCheckboxRajain(rajainValues, tyyppi)
  );

const labelText = (val: number) => (val > 0 ? `${val}€` : '0');
const rangeText = (v: NumberRangeValues) =>
  match(v)
    .when(
      () => isEqual(v.numberRangeValues, v.undefinedValue),
      () => ''
    )
    .with(
      { numberRangeValues: P.select(P.array(P.number)) },
      (values) =>
        ` ${labelText(values[0])}` +
        (values[0] === values[1] ? '' : ` - ${labelText(values[1])}`)
    );

const maksullisuustyyppiChanges = (
  rajainValues: Array<RajainItem>,
  rajainItem: RajainItem
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

const useNumberRangeValues = (
  rajainName: MaksunMaaraRajainName,
  rajainValues: Array<RajainItem>
) =>
  useMemo(
    () => getNumberRangeValues(getNumberRangeRajain(rajainValues, rajainName)),
    [rajainValues, rajainName]
  );

const MaksullisuusRangeSlider = ({
  rajainName,
  rajainValues = [],
  setFilters,
}: Pick<SuodatinComponentProps, 'rajainValues' | 'setFilters'> & {
  rajainName: MaksunMaaraRajainName;
}) => {
  const { undefinedValue, numberRangeValues } = useNumberRangeValues(
    rajainName,
    rajainValues
  );
  const setMaksuRange = (maksuRange: Array<number>) =>
    setFilters(
      rangeRajainObject(
        rajainName,
        isEqual(maksuRange, undefinedValue) ? undefinedValue : maksuRange
      )
    );

  // Näytetään slider vain, jos sille on tullut konfo-backendiltä jokin järkevä yläraja (oletus nolla)
  // Nolla tarkoittaa ettei dataa ei ole saatu ladattua, tai rajaimen millekään arvolle ei ole olemassa yhtään tulosta.
  return undefinedValue?.[1] === 0 ? null : (
    <Box mr={2} ml={1}>
      <NumberRangeSlider
        values={numberRangeValues}
        min={undefinedValue[0]}
        max={undefinedValue[1]}
        marks={marks(undefinedValue[1])}
        labelFormatter={labelText}
        onRangeCommit={setMaksuRange}
      />
    </Box>
  );
};

const MaksullisuusSummary = ({
  rajainValues = [],
  displaySelected,
}: Pick<SuodatinComponentProps, 'rajainValues' | 'displaySelected'>) => {
  const { t } = useTranslation();
  const maksunmaara = useNumberRangeValues(FILTER_TYPES.MAKSUNMAARA, rajainValues);
  const lukuvuosimaksu = useNumberRangeValues(
    FILTER_TYPES.LUKUVUOSIMAKSUNMAARA,
    rajainValues
  );

  const selectedRajainItems =
    maksullisuustyyppiRajainItems(rajainValues).filter(isChecked);

  const contentString = useMemo(
    () =>
      selectedRajainItems
        .map(
          (item) =>
            t(`haku.${item.id}`) +
            match(item)
              .with({ id: 'maksullinen' }, () => rangeText(maksunmaara))
              .with(
                { id: 'lukuvuosimaksu' },
                () =>
                  rangeText(lukuvuosimaksu) +
                  (isChecked(getCheckboxRajain(rajainValues, 'apuraha'))
                    ? t('haku.apuraha')
                    : '')
              )
              .otherwise(() => '')
        )
        .join(','),
    [selectedRajainItems, maksunmaara, lukuvuosimaksu, rajainValues, t]
  );

  return (
    <SuodatinAccordionSummary expandIcon={<ExpandMore />}>
      <SummaryContent
        filterName={t('haku.maksullisuus')}
        contentString={contentString}
        numberOfItems={selectedRajainItems.length}
        displaySelected={displaySelected}
      />
    </SuodatinAccordionSummary>
  );
};

type InputsSectionProps = Pick<SuodatinComponentProps, 'rajainValues' | 'setFilters'> & {
  isCountVisible?: boolean;
};

const MaksullinenInputs = ({
  rajainValues = [],
  setFilters,
  isCountVisible,
}: InputsSectionProps) => (
  <>
    <FilterCheckbox
      value={getCheckboxRajain(rajainValues, 'maksullinen')}
      handleCheck={(item) => setFilters(maksullisuustyyppiChanges(rajainValues, item))}
      isCountVisible={isCountVisible}
    />
    {isChecked(getCheckboxRajain(rajainValues, 'maksullinen')) && (
      <MaksullisuusRangeSlider
        rajainName="maksunmaara"
        setFilters={setFilters}
        rajainValues={rajainValues}
      />
    )}
  </>
);

const LukuvuosimaksuInputs = ({
  rajainValues = [],
  setFilters,
  isCountVisible,
}: InputsSectionProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <FilterCheckbox
          value={getCheckboxRajain(rajainValues, 'lukuvuosimaksu')}
          handleCheck={(item) =>
            setFilters(maksullisuustyyppiChanges(rajainValues, item))
          }
          isCountVisible={isCountVisible}
          additionalInfo={t('haku.lukuvuosimaksu-tooltip')}
        />
      </Box>
      {isChecked(getCheckboxRajain(rajainValues, 'lukuvuosimaksu')) && (
        <MaksullisuusRangeSlider
          rajainName="lukuvuosimaksunmaara"
          rajainValues={rajainValues}
          setFilters={setFilters}
        />
      )}
      <FilterCheckbox
        key={FILTER_TYPES.APURAHA}
        value={getCheckboxRajain(rajainValues, 'apuraha')}
        handleCheck={(item: RajainItem) =>
          setFilters({
            apuraha: !isChecked(item),
          })
        }
        isCountVisible={false}
        disabled={!isChecked(getCheckboxRajain(rajainValues, 'lukuvuosimaksu'))}
      />
    </>
  );
};

export const MaksullisuusSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainValues = [],
  setFilters,
}: SuodatinComponentProps) => {
  const config = useConfig();
  const isCountVisible = config?.naytaFiltterienHakutulosLuvut;
  return (
    <SuodatinAccordion elevation={elevation} defaultExpanded={expanded} square>
      {!summaryHidden && (
        <MaksullisuusSummary
          rajainValues={rajainValues}
          displaySelected={displaySelected}
        />
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List sx={{ width: '100%' }}>
          <FilterCheckbox
            value={getCheckboxRajain(rajainValues, 'maksuton')}
            handleCheck={(item) =>
              setFilters(maksullisuustyyppiChanges(rajainValues, item))
            }
            isCountVisible={isCountVisible}
          />
          <MaksullinenInputs
            rajainValues={rajainValues}
            setFilters={setFilters}
            isCountVisible={isCountVisible}
          />
          <LukuvuosimaksuInputs
            rajainValues={rajainValues}
            setFilters={setFilters}
            isCountVisible={isCountVisible}
          />
        </List>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
