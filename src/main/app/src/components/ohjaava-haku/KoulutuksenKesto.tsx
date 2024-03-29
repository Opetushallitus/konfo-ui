import React, { useState } from 'react';

import { Grid, Typography } from '@mui/material';
import { isEmpty, isFinite, toNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { CustomInputLabel } from '#/src/components/ohjaava-haku/common/CustomInputLabel';
import { ErrorMessage } from '#/src/components/ohjaava-haku/common/ErrorMessage';
import {
  InputContainer,
  InputFieldContainer,
} from '#/src/components/ohjaava-haku/common/InputContainer';
import { InputWithUnit } from '#/src/components/ohjaava-haku/common/InputWithUnit';
import { Ndash } from '#/src/components/ohjaava-haku/common/Ndash';
import { QuestionInfoText } from '#/src/components/ohjaava-haku/Question';
import {
  getChangedKestoInMonths,
  getYearsAndMonthsFromRangeValue,
} from '#/src/components/ohjaava-haku/utils';
import { KoulutuksenKestoSlider } from '#/src/components/suodattimet/common/KoulutuksenKestoSuodatin';
import { RajainItem, NumberRangeRajainItem } from '#/src/types/SuodatinTypes';

import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';

const DEFAULT_UPPERLIMIT = 72;

export const KoulutuksenKesto = ({
  rajainItems,
  setErrorKey,
  errorKey,
}: {
  rajainItems: Array<RajainItem>;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const { t } = useTranslation();

  const { allSelectedRajainValues, setAllSelectedRajainValues } = useOhjaavaHaku(
    (s) => s
  );

  const rajainItem = rajainItems?.[0] as NumberRangeRajainItem;
  const undefinedRajainValues = [0, rajainItem?.upperLimit || DEFAULT_UPPERLIMIT];

  const initialEnintaan = rajainItem?.max || undefinedRajainValues[1];
  const initialEnintaanVStr = isFinite(initialEnintaan)
    ? Math.floor(initialEnintaan / 12).toString()
    : '';
  const initialEnintaanKkStr = isFinite(initialEnintaan)
    ? (initialEnintaan % 12).toString()
    : '';
  const [rangeValues, setRangeValues] = useState([
    rajainItem?.min || undefinedRajainValues[0],
    initialEnintaan || undefinedRajainValues[1],
  ]);

  const [vahintaan, setVahintaan] = useState(['0', '0']);
  const [enintaan, setEnintaan] = useState([initialEnintaanVStr, initialEnintaanKkStr]);

  const handleSliderValueCommit = (newValues: Array<number>) => {
    const newMin = newValues[0];
    const newMax = newValues[1];
    setVahintaan(getYearsAndMonthsFromRangeValue(newMin) as Array<string>);
    setEnintaan(getYearsAndMonthsFromRangeValue(newMax) as Array<string>);
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      koulutuksenkestokuukausina: {
        koulutuksenkestokuukausina_min: newMin,
        koulutuksenkestokuukausina_max: newMax,
      },
    });
  };

  const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = event.target.value;

    const newValues = match(event.target.id)
      .with('vahintaan-vuosi', () => {
        setVahintaan([changedValue, vahintaan[1]]);
        const kestoInMonths = getChangedKestoInMonths(changedValue, vahintaan[1]);
        return [kestoInMonths, rangeValues[1]];
      })
      .with('vahintaan-kk', () => {
        setVahintaan([vahintaan[0], changedValue]);
        const kestoInMonths = getChangedKestoInMonths(vahintaan[0], changedValue);
        return [kestoInMonths, rangeValues[1]];
      })
      .with('enintaan-vuosi', () => {
        setEnintaan([changedValue, enintaan[1]]);
        const kestoInMonths = getChangedKestoInMonths(changedValue, enintaan[1]);
        return [rangeValues[0], kestoInMonths];
      })
      .with('enintaan-kk', () => {
        setEnintaan([enintaan[0], changedValue]);
        const kestoInMonths = getChangedKestoInMonths(enintaan[0], changedValue);
        return [rangeValues[0], kestoInMonths];
      })
      .otherwise(() => rangeValues);

    const newMin = newValues[0];
    const newMax = newValues[1];
    newMin > newMax
      ? setErrorKey('minimikesto-suurempi-kuin-maksimikesto')
      : setErrorKey('');
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      koulutuksenkestokuukausina: {
        koulutuksenkestokuukausina_min: newMin,
        koulutuksenkestokuukausina_max: newMax,
      },
    });
  };

  const unit = (id: string) => <Typography>{t(`haku.lyhenne-${id}`)}</Typography>;
  const errorId = 'koulutuksen-kesto-error';

  const ariaValueText = (value: number) => {
    const [years, months] = getYearsAndMonthsFromRangeValue(
      value,
      false
    ) as Array<number>;
    const yearsWithUnit =
      years === 1
        ? t('koulutus.kesto-vuosi', { count: years })
        : toNumber(years) > 0
        ? t('koulutus.kesto-vuosi_plural', { count: years })
        : '';
    const monthsWithUnit =
      months === 1
        ? t('koulutus.kesto-kuukausi', {
            count: months,
          })
        : t('koulutus.kesto-kuukausi_plural', {
            count: months,
          });

    return `${yearsWithUnit} ${monthsWithUnit}`;
  };

  return (
    <Grid container direction="column" wrap="nowrap">
      <QuestionInfoText questionInfo={t(`ohjaava-haku.kysymykset.info-text`)} />
      <InputContainer item container direction="row" wrap="nowrap">
        <InputFieldContainer item container direction="column" wrap="nowrap" xs={3}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-vahintaan" />
          <InputFieldContainer>
            <InputWithUnit
              id="vahintaan-vuosi"
              value={vahintaan[0]}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit('vuosi')}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-vahintaan-vuotta-accessible-label'
              )}
              ariaDescribedby={errorId}
              type="number"
            />
            <InputWithUnit
              id="vahintaan-kk"
              value={vahintaan[1]}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit('kuukausi')}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-vahintaan-kk-accessible-label'
              )}
              ariaDescribedby={errorId}
              type="number"
            />
          </InputFieldContainer>
        </InputFieldContainer>
        <Ndash />
        <InputFieldContainer item container direction="column" wrap="nowrap" xs={3}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-enintaan" />
          <InputFieldContainer>
            <InputWithUnit
              id="enintaan-vuosi"
              value={enintaan[0]}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit('vuosi')}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-enintaan-vuotta-accessible-label'
              )}
              ariaDescribedby={errorId}
              type="number"
            />
            <InputWithUnit
              id="enintaan-kk"
              value={enintaan[1]}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit('kuukausi')}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.koulutuksenkestokuukausina.opiskelen-enintaan-kk-accessible-label'
              )}
              ariaDescribedby={errorId}
              type="number"
            />
          </InputFieldContainer>
        </InputFieldContainer>
      </InputContainer>
      {!isEmpty(errorKey) && <ErrorMessage id={errorId} errorKey={errorKey} />}
      <KoulutuksenKestoSlider
        rangeValues={rangeValues}
        undefinedRajainValues={undefinedRajainValues}
        handleSliderValueCommit={handleSliderValueCommit}
        sliderLabel={t('haku.koulutuksenkestokuukausina')}
        ariaValueText={ariaValueText}
      />
    </Grid>
  );
};
