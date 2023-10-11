import React, { useState } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { NumberRangeSlider } from '#/src/components/common/Filter/NumberRangeSlider';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { InputWithUnit } from '#/src/components/ohjaava-haku/common/InputWithUnit';
import { useOhjaavaHakuContext } from '#/src/components/ohjaava-haku/OhjaavaHakuContext';
import {
  QuestionInfoText,
  Rajain,
  RajainOption,
} from '#/src/components/ohjaava-haku/Question';
import { combineMaksunMaaraWithMaksullisuustyyppi } from '#/src/components/ohjaava-haku/utils';
import { marks } from '#/src/components/suodattimet/common/maksullisuusRajainUtils';
import { NumberRangeRajainItem, RajainItem } from '#/src/types/SuodatinTypes';

import { CustomInputLabel } from './common/CustomInputLabel';
import { Ndash } from './common/Ndash';
import { classes } from './StyledRoot';

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
  const labelText = (val: number) => (val > 0 ? `${val}€` : '0');

  return undefinedRajainValues?.[1] === 0 ? null : (
    <Box mr={2} ml={1}>
      <NumberRangeSlider
        values={rangeValues}
        min={undefinedRajainValues[0]}
        max={undefinedRajainValues[1]}
        marks={marks(undefinedRajainValues[1])}
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
}: {
  id: string;
  rajainItems?: Array<RajainItem>;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const { t } = useTranslation();

  const { allSelectedRajainValues, setAllSelectedRajainValues } = useOhjaavaHakuContext();
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
    if (id === 'lukuvuosimaksu') {
      return {
        lukuvuosimaksunmaara: {
          lukuvuosimaksunmaara_min: newMin,
          lukuvuosimaksunmaara_max: newMax,
        },
      };
    } else {
      return {
        maksunmaara: {
          maksunmaara_min: newMin,
          maksunmaara_max: newMax,
        },
      };
    }
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
    const changedValueNumber = parseInt(changedValue);

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
      ? setErrorKey('vahintaan-suurempi-kuin-enintaan')
      : setErrorKey('');
    setRangeValues(newValues);
    setAllSelectedRajainValues({
      ...allSelectedRajainValues,
      ...maksunMaara(newValues),
    });
  };

  const unit = () => (
    <MaterialIcon
      className={classes.question__lyhenne}
      icon="euro_symbol"
      fontSize="small"
    />
  );

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid
        item
        container
        direction="row"
        wrap="nowrap"
        className={classes.question__inputContainer}>
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          xs={3}
          className={classes.question__inputFieldContainer}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.maksullisuustyyppi.vahintaan" />
          <InputWithUnit
            id={`${id}-vahintaan`}
            value={vahintaan}
            handleInputValueChange={handleInputValueChange}
            unitComponent={unit()}
            inputLabel="euro"
          />
        </Grid>
        <Ndash />
        <Grid
          item
          container
          direction="column"
          wrap="nowrap"
          xs={3}
          className={classes.question__inputFieldContainer}>
          <CustomInputLabel translationKey="ohjaava-haku.kysymykset.maksullisuustyyppi.enintaan" />
          <InputWithUnit
            id={`${id}-enintaan`}
            value={enintaan}
            handleInputValueChange={handleInputValueChange}
            unitComponent={unit()}
            inputLabel="euro"
          />
        </Grid>
      </Grid>
      {!isEmpty(errorKey) && (
        <Typography className={classes.error}>
          {t(`ohjaava-haku.error.${errorKey}`)}
        </Typography>
      )}
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
  const { allSelectedRajainValues, toggleAllSelectedRajainValues } =
    useOhjaavaHakuContext();

  const maksullisuustyyppiRajainItems =
    combineMaksunMaaraWithMaksullisuustyyppi(rajainItems);

  return (
    <Grid item className={classes.question}>
      <QuestionInfoText
        questionInfo={t(`ohjaava-haku.kysymykset.info-text-for-options`)}
      />
      {maksullisuustyyppiRajainItems.map(({ id, rajainId, linkedRajainItems }) => {
        const selectedRajainItems = allSelectedRajainValues[rajainId] as Array<string>;
        const isRajainSelected = selectedRajainItems && selectedRajainItems.includes(id);

        return (
          <Box key={id}>
            <RajainOption
              id={id}
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
              />
            )}
          </Box>
        );
      })}
    </Grid>
  );
};
