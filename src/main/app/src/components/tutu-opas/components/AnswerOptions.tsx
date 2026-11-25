import { Box } from '@mui/material';
import { OphButton, ophColors } from '@opetushallitus/oph-design-system';

import { Dispatch } from 'react';
import { AnswerOptionType, TutuObject } from '../types';

const AnswerOption = ({
  answerOption,
  setCurrentObject,
  tutuConfigObjects,
}: {
  answerOption: AnswerOptionType;
  setCurrentObject: Dispatch<TutuObject | undefined>;
  tutuConfigObjects: Array<TutuObject>;
}) => {
  const nextAnswerId = answerOption?.target;
  const nextAnswerObject = tutuConfigObjects.find(
    (tutuOption: TutuObject) => tutuOption.id === nextAnswerId
  );

  return (
    <OphButton
      onClick={() => setCurrentObject(nextAnswerObject)}
      variant="contained"
      sx={{
        backgroundColor: ophColors.green5,
        color: ophColors.grey900,
        marginBottom: '0.5rem',
        justifyContent: 'left',
        textAlign: 'left',
        '&:hover': {
          backgroundColor: ophColors.green2,
          color: ophColors.white,
        },
      }}>
      {answerOption?.label}
    </OphButton>
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
    <Box display="flex" flexDirection="column" aria-labelledby={labelId}>
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
