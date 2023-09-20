import React, { useState } from 'react';

import { Box, Grid, Typography } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { colors } from '#/src/colors';
import { NumberRangeSlider } from '#/src/components/common/Filter/NumberRangeSlider';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { KoulutuksenKestoInput } from '#/src/components/ohjaava-haku/KoulutuksenKesto';
import { Rajain, RajainOption } from '#/src/components/ohjaava-haku/Kysymys';
import { combineMaksunMaaraWithMaksullisuustyyppi } from '#/src/components/ohjaava-haku/utils';
import { marks } from '#/src/components/suodattimet/common/maksullisuusRajainUtils';
import { NDASH } from '#/src/constants';
import { styled } from '#/src/theme';
import { NumberRangeRajainItem, RajainItem } from '#/src/types/SuodatinTypes';

const DEFAULT_UPPERLIMIT = 20000;

const PREFIX = 'ohjaava-haku__';

const classes = {
  root: `${PREFIX}root`,
  input: `${PREFIX}input`,
  inputContainer: `${PREFIX}input-container`,
  lyhenne: `${PREFIX}lyhenne`,
  ndash: `${PREFIX}ndash`,
  error: `${PREFIX}error`,
};

const Root = styled('div')`
  & .${classes.root} {
    display: flex;
  }
  & .${classes.input} {
    display: flex;
    gap: 0.5rem;
  }
  & .${classes.inputContainer} {
    display: flex;
    gap: 1.5rem;
  }
  & .${classes.lyhenne} {
    align-self: center;
  }
  & .${classes.ndash} {
    display: flex;
    justify-content: center;
    align-items: end;
  }
  & .${classes.error} {
    color: ${colors.red};
    margin-top: 1rem;
  }
`;

const MaksullisuusRangeSlider = ({
  rangeValues,
  undefinedRajainValues,
  handleSliderValueCommit,
}: {
  rangeValues: Array<number>;
  undefinedRajainValues: Array<number>;
  handleSliderValueCommit: (val: Array<number>) => void;
}) => {
  const labelText = (val: number) => (val > 0 ? `${val}€` : '0');
  // Näytetään slider vain, jos sille on tullut konfo-backendiltä jokin järkevä yläraja (oletus nolla)
  // Nolla tarkoittaa ettei dataa ei ole saatu ladattua, tai rajaimen millekään arvolle ei ole olemassa yhtään tulosta.
  return undefinedRajainValues?.[1] === 0 ? null : (
    <Box mr={2} ml={1}>
      <NumberRangeSlider
        values={rangeValues}
        min={undefinedRajainValues[0]}
        max={undefinedRajainValues[1]}
        marks={marks(undefinedRajainValues[1])}
        labelFormatter={labelText}
        onRangeCommit={handleSliderValueCommit}
      />
    </Box>
  );
};

const MaksullisuusInput = ({
  id,
  rajainItems,
  allSelectedRajainValues,
  setAllSelectedRajainValues,
  setErrorKey,
  errorKey,
}: {
  id: string;
  rajainItems?: Array<RajainItem>;
  allSelectedRajainValues: Rajain;
  setAllSelectedRajainValues: (val: Rajain) => void;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const { t } = useTranslation();

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
    const min = newValues[0];
    const max = newValues[1];
    if (id === 'lukuvuosimaksu') {
      return {
        lukuvuosimaksunmaara: {
          lukuvuosimaksunmaara_min: min,
          lukuvuosimaksunmaara_max: max,
        },
      };
    } else {
      return {
        maksunmaara: {
          maksunmaara_min: min,
          maksunmaara_max: max,
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
      .with('vahintaan', () => {
        const changed = isFinite(changedValueNumber) ? changedValueNumber : 0;
        setVahintaan(changedValue);
        return [changed, rangeValues[1]];
      })
      .with('enintaan', () => {
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

  const unitComponent = () => (
    <MaterialIcon className={classes.lyhenne} icon="euro_symbol" fontSize="small" />
  );
  return (
    <Root className={classes.root}>
      <Grid container direction="column" wrap="nowrap">
        <Grid
          item
          container
          direction="row"
          wrap="nowrap"
          className={classes.inputContainer}>
          <Grid item container direction="column" wrap="nowrap" xs={3}>
            <Typography sx={{ fontWeight: '600' }}>
              {t('ohjaava-haku.kysymykset.maksullisuustyyppi.vahintaan')}
            </Typography>
            <KoulutuksenKestoInput
              id="vahintaan"
              value={vahintaan}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unitComponent()}
            />
          </Grid>
          <Grid item className={classes.ndash}>
            <Typography sx={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              {NDASH}
            </Typography>
          </Grid>
          <Grid item container direction="column" wrap="nowrap" xs={3}>
            <Typography sx={{ fontWeight: '600' }}>
              {t('ohjaava-haku.kysymykset.maksullisuustyyppi.enintaan')}
            </Typography>
            <KoulutuksenKestoInput
              id="enintaan"
              value={enintaan}
              handleInputValueChange={handleInputValueChange}
              unitComponent={unitComponent()}
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
    </Root>
  );
};

export const Maksullisuus = ({
  rajainItems,
  allSelectedRajainValues,
  toggleAllSelectedRajainValues,
  setAllSelectedRajainValues,
  setErrorKey,
  errorKey,
}: {
  rajainItems: Array<RajainItem>;
  allSelectedRajainValues: Rajain;
  toggleAllSelectedRajainValues: (id: string, rajainId: string) => void;
  setAllSelectedRajainValues: (val: Rajain) => void;
  setErrorKey: (errorKey: string) => void;
  errorKey: string;
}) => {
  const maksullisuustyyppiRajainItems =
    combineMaksunMaaraWithMaksullisuustyyppi(rajainItems);

  return (
    <Grid item className="question">
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
                allSelectedRajainValues={allSelectedRajainValues}
                setAllSelectedRajainValues={setAllSelectedRajainValues}
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
