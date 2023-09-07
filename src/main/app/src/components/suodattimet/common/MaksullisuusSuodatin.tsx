import React, { useMemo } from 'react';

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
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { useConfig } from '#/src/config';
import { FILTER_TYPES } from '#/src/constants';
import {
  getStateChangesForCheckboxRajaimet,
  isChecked,
  useRajainItems,
} from '#/src/tools/filters';
import {
  RajainComponentProps,
  RajainItem,
  NumberRangeRajainId,
} from '#/src/types/SuodatinTypes';

import { marks } from './maksullisuusRajainUtils';

type MaksunMaaraRajainName = 'maksunmaara' | 'lukuvuosimaksunmaara';

const getCheckboxRajain = (rajainItems: Array<RajainItem>, id: string): RajainItem =>
  rajainItems.find((r) => r.id === id) ?? {
    rajainId: 'maksullisuustyyppi',
    id,
    count: 0,
    checked: false,
  };

const getNumberRangeRajain = (
  rajainItems: Array<RajainItem>,
  rajainId: NumberRangeRajainId
) =>
  rajainItems?.find((r) => r.rajainId === rajainId) ?? {
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

const rangeRajainObject = (rajainName: string, rangeValues: Array<number>) => ({
  [rajainName]: {
    [`${rajainName}_min`]: rangeValues[0],
    [`${rajainName}_max`]: rangeValues[1],
  },
});

const maksullisuustyyppiSetDisabled = (
  rajainItems: Array<RajainItem>,
  newRajainValues: Array<string>,
  tyyppi: string
) =>
  isChecked(getCheckboxRajain(rajainItems, tyyppi)) && !newRajainValues.includes(tyyppi);

const maksullisuustyyppiRajainItems = (rajainItems: Array<RajainItem>) =>
  ['maksuton', 'maksullinen', 'lukuvuosimaksu'].map((tyyppi) =>
    getCheckboxRajain(rajainItems, tyyppi)
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
  rajainItems: Array<RajainItem>,
  rajainItem: RajainItem
) => {
  let changes = getStateChangesForCheckboxRajaimet(
    maksullisuustyyppiRajainItems(rajainItems)
  )(rajainItem);

  if (
    maksullisuustyyppiSetDisabled(rajainItems, changes.maksullisuustyyppi, 'maksullinen')
  ) {
    changes = Object.assign(changes, rangeRajainObject('maksunmaara', [0, 0]));
  }
  if (
    maksullisuustyyppiSetDisabled(
      rajainItems,
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
  rajainItems: Array<RajainItem>
) =>
  useMemo(
    () => getNumberRangeValues(getNumberRangeRajain(rajainItems, rajainName)),
    [rajainItems, rajainName]
  );

const MaksullisuusRangeSlider = ({
  rajainName,
  rajainItems = [],
  setFilters,
}: Pick<RajainComponentProps, 'setFilters'> & {
  rajainItems?: Array<RajainItem>;
  rajainName: MaksunMaaraRajainName;
}) => {
  const { undefinedValue, numberRangeValues } = useNumberRangeValues(
    rajainName,
    rajainItems
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
  rajainItems = [],
  displaySelected,
}: Pick<RajainComponentProps, 'displaySelected'> & {
  rajainItems?: Array<RajainItem>;
}) => {
  const { t } = useTranslation();
  const maksunmaara = useNumberRangeValues(FILTER_TYPES.MAKSUNMAARA, rajainItems);
  const lukuvuosimaksu = useNumberRangeValues(
    FILTER_TYPES.LUKUVUOSIMAKSUNMAARA,
    rajainItems
  );

  const selectedRajainItems =
    maksullisuustyyppiRajainItems(rajainItems).filter(isChecked);

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
                  (isChecked(getCheckboxRajain(rajainItems, 'apuraha'))
                    ? t('haku.apuraha')
                    : '')
              )
              .otherwise(() => '')
        )
        .join(','),
    [selectedRajainItems, maksunmaara, lukuvuosimaksu, rajainItems, t]
  );

  return (
    <SuodatinAccordionSummary expandIcon={<MaterialIcon icon="expand_more" />}>
      <SummaryContent
        filterName={t('haku.maksullisuus')}
        contentString={contentString}
        numberOfItems={selectedRajainItems.length}
        displaySelected={displaySelected}
      />
    </SuodatinAccordionSummary>
  );
};

type InputsSectionProps = Pick<RajainComponentProps, 'setFilters'> & {
  rajainItems?: Array<RajainItem>;
  isCountVisible?: boolean;
};

const MaksullinenInputs = ({
  rajainItems = [],
  setFilters,
  isCountVisible,
}: InputsSectionProps) => (
  <>
    <FilterCheckbox
      value={getCheckboxRajain(rajainItems, 'maksullinen')}
      handleCheck={(item) => setFilters(maksullisuustyyppiChanges(rajainItems, item))}
      isCountVisible={isCountVisible}
    />
    {isChecked(getCheckboxRajain(rajainItems, 'maksullinen')) && (
      <MaksullisuusRangeSlider
        rajainName="maksunmaara"
        setFilters={setFilters}
        rajainItems={rajainItems}
      />
    )}
  </>
);

const LukuvuosimaksuInputs = ({
  rajainItems = [],
  setFilters,
  isCountVisible,
}: InputsSectionProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <FilterCheckbox
          value={getCheckboxRajain(rajainItems, 'lukuvuosimaksu')}
          handleCheck={(item) => setFilters(maksullisuustyyppiChanges(rajainItems, item))}
          isCountVisible={isCountVisible}
          additionalInfo={t('haku.lukuvuosimaksu-tooltip')}
        />
      </Box>
      {isChecked(getCheckboxRajain(rajainItems, 'lukuvuosimaksu')) && (
        <MaksullisuusRangeSlider
          rajainName="lukuvuosimaksunmaara"
          rajainItems={rajainItems}
          setFilters={setFilters}
        />
      )}
      <FilterCheckbox
        key={FILTER_TYPES.APURAHA}
        value={getCheckboxRajain(rajainItems, 'apuraha')}
        handleCheck={(item: RajainItem) =>
          setFilters({
            apuraha: !isChecked(item),
          })
        }
        isCountVisible={false}
        disabled={!isChecked(getCheckboxRajain(rajainItems, 'lukuvuosimaksu'))}
      />
    </>
  );
};

export const MaksullisuusSuodatin = ({
  summaryHidden,
  displaySelected = true,
  elevation = 0,
  expanded,
  rajainOptions,
  rajainValues,
  setFilters,
}: RajainComponentProps) => {
  const config = useConfig();
  const isCountVisible = config?.naytaFiltterienHakutulosLuvut;

  const rajainItems = useRajainItems(
    rajainOptions,
    rajainValues,
    FILTER_TYPES.MAKSULLISUUS
  );

  return (
    <SuodatinAccordion elevation={elevation} defaultExpanded={expanded} square>
      {!summaryHidden && (
        <MaksullisuusSummary
          rajainItems={rajainItems}
          displaySelected={displaySelected}
        />
      )}
      <SuodatinAccordionDetails {...(summaryHidden && { style: { padding: 0 } })}>
        <List sx={{ width: '100%' }}>
          <FilterCheckbox
            value={getCheckboxRajain(rajainItems, 'maksuton')}
            handleCheck={(item) =>
              setFilters(maksullisuustyyppiChanges(rajainItems, item))
            }
            isCountVisible={isCountVisible}
          />
          <MaksullinenInputs
            rajainItems={rajainItems}
            setFilters={setFilters}
            isCountVisible={isCountVisible}
          />
          <LukuvuosimaksuInputs
            rajainItems={rajainItems}
            setFilters={setFilters}
            isCountVisible={isCountVisible}
          />
        </List>
      </SuodatinAccordionDetails>
    </SuodatinAccordion>
  );
};
