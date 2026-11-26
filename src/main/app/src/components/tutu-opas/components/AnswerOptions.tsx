import { Box } from '@mui/material';
import { OphButton, ophColors } from '@opetushallitus/oph-design-system';

import { Dispatch } from 'react';
import { useTheme } from '@mui/system';
import { useLanguageState } from '#/src/hooks';
import { AnswerOptionType, TutuObject } from '../types';
import { getTutuTranslation } from '../utils';

const AnswerOption = ({
  answerOption,
  setCurrentObject,
  tutuConfigObjects,
}: {
  answerOption: AnswerOptionType;
  setCurrentObject: Dispatch<TutuObject | undefined>;
  tutuConfigObjects: Array<TutuObject>;
}) => {
  const theme = useTheme();
  const [lng] = useLanguageState();

  const nextAnswerId = answerOption?.target;
  const nextAnswerObject = tutuConfigObjects.find(
    (tutuOption: TutuObject) => tutuOption.id === nextAnswerId
  );
  // Ei näytetä vastausvaihtoehtoa, jonka kohdetta ei löydy tai jolle ei ole sisältöä
  const hasValidTarget = Boolean(getTutuTranslation(nextAnswerObject, lng));

  const selectOption = () => {
    setCurrentObject(nextAnswerObject);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {hasValidTarget && (
        <OphButton
          onClick={selectOption}
          variant="contained"
          sx={{
            backgroundColor: ophColors.green5,
            color: ophColors.grey900,
            marginBottom: theme.spacing(1),
            justifyContent: 'left',
            textAlign: 'left',
            '&:hover': {
              backgroundColor: ophColors.green2,
              color: ophColors.white,
            },
          }}>
          {answerOption?.label}
        </OphButton>
      )}
    </>
  );
};

export const AnswerOptions = ({
  answerOptions,
  setCurrentObject,
  tutuConfigObjects,
  labelId,
}: {
  answerOptions?: Array<AnswerOptionType>;
  setCurrentObject: Dispatch<TutuObject | undefined>;
  tutuConfigObjects: Array<TutuObject>;
  labelId: string;
}) => {
  return (
    <Box display="flex" flexDirection="column" role="group" aria-labelledby={labelId}>
      {answerOptions?.map((answerOption: AnswerOptionType) => (
        <AnswerOption
          answerOption={answerOption}
          key={answerOption.id}
          setCurrentObject={setCurrentObject}
          tutuConfigObjects={tutuConfigObjects}
        />
      ))}
    </Box>
  );
};
