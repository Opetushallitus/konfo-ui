import { Box } from '@mui/material';
import { OphButton } from '@opetushallitus/oph-design-system';

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
        marginBottom: '0.5rem',
        justifyContent: 'left',
        textAlign: 'left',
      }}>
      {answerOption?.label}
    </OphButton>
  );
};

export const AnswerOptions = ({
  answerOptions,
  setCurrentObject,
  tutuConfigObjects,
}: {
  answerOptions?: Array<AnswerOptionType>;
  setCurrentObject: Dispatch<TutuObject | undefined>;
  tutuConfigObjects: Array<TutuObject>;
}) => {
  return (
    <Box display="flex" flexDirection="column">
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
