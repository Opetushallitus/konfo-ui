import React, { useState } from 'react';

import { Button, Grid, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { FILTER_TYPES } from '#/src/constants';

import { useFilterProps, useSearch } from '../../components/haku/hakutulosHooks';
import { Heading } from '../Heading';

const Root = styled('div')`
  & .question {
   display: flex;
   flex-direction: column;
   gap: 0.75rem;
   margin-bottom: 1rem;

   &__option {
     justify-content: start;
     background-color: #e3ecdd;
     color: ${colors.black};
     padding-left: 1rem;
     padding-right: 1rem;

     &:hover {
       background-color: #a5c291;
     }

     &[data-selected] {
       background-color: ${colors.brandGreen};
       color: ${colors.white};
     }
  }
`;

type Kysymys = {
  id: string;
};

type KysymysProps = {
  kysymys: Kysymys;
  currentKysymysIndex: number;
  setCurrentKysymysIndex: (index: number) => void;
  lastKysymysIndex: number;
};

export const Kysymys = ({
  kysymys,
  currentKysymysIndex,
  setCurrentKysymysIndex,
  lastKysymysIndex,
}: KysymysProps) => {
  const { t } = useTranslation();
  const kysymysTitle = t(`ohjaava-haku.kysymykset.${kysymys.id}`);
  const isLastKysymys = currentKysymysIndex === lastKysymysIndex;
  const { goToSearchPage, setFilters } = useSearch();
  const filterProps = useFilterProps(FILTER_TYPES.OPETUSAIKA);
  const [selectedRajainValues, setSelectedRajainValues] = useState<Array<string>>([]);
  const toggleRajainValue = (id: string) => {
    if (selectedRajainValues.includes(id)) {
      setSelectedRajainValues(selectedRajainValues.filter((v) => v !== id));
    } else {
      setSelectedRajainValues([...selectedRajainValues, id]);
    }
  };

  const handleClick = () => {
    const filterId = filterProps[0].filterId;
    setFilters({ [filterId]: selectedRajainValues });
    goToSearchPage();
  };

  const isSelected = (id: string) => selectedRajainValues.includes(id);

  return (
    <Root>
      <Grid container width="100%" alignItems="start">
        <Grid item xs={12}>
          <Heading>{kysymysTitle}</Heading>
        </Grid>
        <div className="question">
          {filterProps.map(({ id }) => {
            return (
              <Button
                {...(isSelected(id) && {
                  startIcon: <MaterialIcon icon="check" />,
                })}
                key={id}
                onClick={() => toggleRajainValue(id)}
                className="question__option"
                {...(isSelected(id) && { 'data-selected': true })}>
                {t(`ohjaava-haku.kysymykset.${id}`)}
              </Button>
            );
          })}
        </div>
        <Grid item xs={12}>
          {isLastKysymys ? (
            <Button onClick={handleClick} variant="contained" color="primary">
              {t('ohjaava-haku.katso-tulokset')}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentKysymysIndex(currentKysymysIndex + 1)}
              variant="contained"
              color="primary">
              {t('ohjaava-haku.seuraava-kysymys')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Root>
  );
};
