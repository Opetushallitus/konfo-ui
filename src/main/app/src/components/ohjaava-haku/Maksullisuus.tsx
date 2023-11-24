import React, { useState } from 'react';

import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { NumberRangeSlider } from '#/src/components/common/Filter/NumberRangeSlider';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import {
  InputContainer,
  InputFieldContainer,
} from '#/src/components/ohjaava-haku/common/InputContainer';
import { InputWithUnit } from '#/src/components/ohjaava-haku/common/InputWithUnit';
import { RajainOption } from '#/src/components/ohjaava-haku/common/RajainOption';
import { QuestionInfoText, Rajain } from '#/src/components/ohjaava-haku/Question';
import {
  combineMaksunMaaraWithMaksullisuustyyppi,
  getIsRajainSelected,
} from '#/src/components/ohjaava-haku/utils';
import { marks } from '#/src/components/suodattimet/common/maksullisuusRajainUtils';
import { NumberRangeRajainItem, RajainItem } from '#/src/types/SuodatinTypes';

import { CustomInputLabel } from './common/CustomInputLabel';
import { ErrorMessage } from './common/ErrorMessage';
import { Ndash } from './common/Ndash';
import { StyledQuestion } from './common/StyledQuestion';
import { useOhjaavaHaku } from './hooks/useOhjaavaHaku';

const DEFAULT_UPPERLIMIT = 20000;

const MaksullisuusRangeSlider = ({
  rangeValues,
  undefinedRajainValues,
  handleSliderValueCommit,
}: {
  rangeValues: Array<number>;
  undefinedRajainValues: Array<number>;
  handleSliderValueCommit: (val: Array<number>) => void;
}) => {
  const { t } = useTranslation();
  const labelText = (val: number) => (val > 0 ? `${val} €` : '0');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return undefinedRajainValues?.[1] === 0 ? null : (
    <Box mr={2} ml={1}>
      <NumberRangeSlider
        values={rangeValues}
        min={undefinedRajainValues[0]}
        max={undefinedRajainValues[1]}
        marks={marks(undefinedRajainValues[1], isMobile)}
        labelFormatter={labelText}
        onRangeCommit={handleSliderValueCommit}
        sliderLabel={t('haku.koulutuksen-hinta')}
      />
    </Box>
  );
};

const MaksullisuusInput = ({
  id,
  rajainItems,
  setErrorKey,
  errorKey,
  allSelectedRajainValues,
}: {
  id: string;
  rajainItems?: Array<RajainItem>;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
  allSelectedRajainValues: Rajain;
}) => {
  const { t } = useTranslation();

  const setAllSelectedRajainValues = useOhjaavaHaku((s) => s.setAllSelectedRajainValues);
  const rajainItem = rajainItems?.[0] as NumberRangeRajainItem;
  const undefinedRajainValues = [0, rajainItem?.upperLimit || DEFAULT_UPPERLIMIT];

  const initialEnintaan = rajainItem?.max || undefinedRajainValues[1];
  const [rangeValues, setRangeValues] = useState([
    rajainItem?.min || undefinedRajainValues[0],
    initialEnintaan || undefinedRajainValues[1],
  ]);

  const [vahintaan, setVahintaan] = useState('0');
  const [enintaan, setEnintaan] = useState(initialEnintaan.toString());

  const maksunMaara = (newValues: Array<number>): Rajain => {
    const newMin = newValues[0];
    const newMax = newValues[1];
    return id === 'lukuvuosimaksu'
      ? {
          lukuvuosimaksunmaara: {
            lukuvuosimaksunmaara_min: newMin,
            lukuvuosimaksunmaara_max: newMax,
          },
        }
      : {
          maksunmaara: {
            maksunmaara_min: newMin,
            maksunmaara_max: newMax,
          },
        };
  };

  const handleSliderValueCommit = (newValues: Array<number>) => {
    setVahintaan(newValues[0].toString());
    setEnintaan(newValues[1].toString());
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      ...maksunMaara(newValues),
    });
  };

  const handleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const changedValue = event.target.value;
    const changedValueWithoutSpaces = changedValue.replace(/\s/g, '');
    const changedValueNumber = parseInt(changedValueWithoutSpaces);

    const newValues = match(event.target.id)
      .with(`${id}-vahintaan`, () => {
        const changed = isFinite(changedValueNumber) ? changedValueNumber : 0;
        setVahintaan(changedValue);
        return [changed, rangeValues[1]];
      })
      .with(`${id}-enintaan`, () => {
        const changed = isFinite(changedValueNumber)
          ? changedValueNumber
          : initialEnintaan;
        setEnintaan(changedValue);
        return [rangeValues[0], changed];
      })
      .otherwise(() => rangeValues);

    newValues[0] > newValues[1]
      ? setErrorKey('minimihinta-suurempi-kuin-maksimihinta')
      : setErrorKey('');
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      ...maksunMaara(newValues),
    });
  };

  const unit = () => <MaterialIcon icon="euro_symbol" fontSize="small" />;
  const errorId = 'maksullisuus-error';
  return (
    <Grid container direction="column" wrap="nowrap">
      <InputContainer item container direction="row" wrap="nowrap">
        <InputFieldContainer item container direction="column" wrap="nowrap" xs={3}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.maksullisuustyyppi.vahintaan" />
          <InputFieldContainer>
            <InputWithUnit
              id={`${id}-vahintaan`}
              value={vahintaan}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit()}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.maksullisuustyyppi.vahintaan-accessible-label'
              )}
              ariaDescribedby={errorId}
            />
          </InputFieldContainer>
        </InputFieldContainer>
        <Ndash />
        <InputFieldContainer item container direction="column" wrap="nowrap" xs={3}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.maksullisuustyyppi.enintaan" />
          <InputFieldContainer>
            <InputWithUnit
              id={`${id}-enintaan`}
              value={enintaan}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unit()}
              ariaLabel={t(
                'ohjaava-haku.kysymykset.maksullisuustyyppi.enintaan-accessible-label'
              )}
              ariaDescribedby={errorId}
            />
          </InputFieldContainer>
        </InputFieldContainer>
      </InputContainer>
      {!isEmpty(errorKey) && <ErrorMessage id={errorId} errorKey={errorKey} />}
      <Grid item sx={{ mx: 1 }}>
        <MaksullisuusRangeSlider
          rangeValues={rangeValues}
          undefinedRajainValues={undefinedRajainValues}
          handleSliderValueCommit={handleSliderValueCommit}
        />
      </Grid>
    </Grid>
  );
};

export const Maksullisuus = ({
  rajainItems,
  setErrorKey,
  errorKey,
}: {
  rajainItems: Array<RajainItem>;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const { t } = useTranslation();
  const { allSelectedRajainValues, toggleAllSelectedRajainValues } = useOhjaavaHaku(
    (s) => s
  );

  const maksullisuustyyppiRajainItems =
    combineMaksunMaaraWithMaksullisuustyyppi(rajainItems);

  return (
    <StyledQuestion item>
      <QuestionInfoText
        questionInfo={t(`ohjaava-haku.kysymykset.info-text-for-options`)}
      />
      {maksullisuustyyppiRajainItems.map(({ id, rajainId, linkedRajainItems }) => {
        const rajainValueIds = [id];
        const isRajainSelected = getIsRajainSelected(
          allSelectedRajainValues,
          rajainId,
          rajainValueIds
        );

        return (
          <Box key={id}>
            <RajainOption
              id={id}
              rajainValueIds={rajainValueIds}
              isRajainSelected={isRajainSelected}
              rajainId={rajainId}
              toggleAllSelectedRajainValues={toggleAllSelectedRajainValues}
            />
            {isRajainSelected && !isEmpty(linkedRajainItems) && (
              <MaksullisuusInput
                id={id}
                rajainItems={linkedRajainItems}
                setErrorKey={setErrorKey}
                errorKey={errorKey}
                allSelectedRajainValues={allSelectedRajainValues}
              />
            )}
          </Box>
        );
      })}
    </StyledQuestion>
  );
};
