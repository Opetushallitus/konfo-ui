import { Box } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'ohjaava-haku__';

export const classes = {
  container: `${PREFIX}container`,
  question: `${PREFIX}question`,
  question__container: `${PREFIX}question__container`,
  question__option: `${PREFIX}question__option`,
  buttonContainer: `${PREFIX}buttonContainer`,
  buttonContainer__previous: `${PREFIX}buttonContainer__previous`,
  buttonContainer__next: `${PREFIX}buttonContainer__next`,
  buttonContainer__results: `${PREFIX}buttonContainer__results`,
  inputContainer: `${PREFIX}input-container`,
  innerInputContainer: `${PREFIX}inner-input-container`,
  inputLabel: `${PREFIX}input-label`,
  lyhenne: `${PREFIX}lyhenne`,
  ndash: `${PREFIX}ndash`,
  ndashContainer: `${PREFIX}ndashContainer`,
  error: `${PREFIX}error`,
  progressSivupalkki: `${PREFIX}progressSivupalkki`,
  progressSivupalkki__button: `${PREFIX}progressSivupalkki__button`,
  progressSivupalkki__button__icon: `${PREFIX}progressSivupalkki__button__icon`,
};

export const StyledRoot = styled(Box)(({ theme }) => {
  return `
  display: flex;
  flex-direction: column;
  width: 100%;

  & .${classes.question} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    margin-bottom: 1rem;

    &__container {
      max-width: 75%;
      margin: 0 2rem;
    }

    &__option {
      justify-content: start;
      background-color: ${colors.lightGrayishGreenBg};
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
  }

  & .${classes.buttonContainer} {
    margin: 1rem 0;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    grid-template-rows: auto;
    grid-template-areas:
      "previous . results next";

    &__previous {
      grid-area: previous;
      font-weight: bold;
    }

    &__next {
      grid-area: next;
    }

    &__results {
      grid-area: results;
      font-weight: bold;
    }
  }

  & .${classes.container} {
    display: flex;
    flex-direction: row;
  }

  & .${classes.inputLabel} {
    font-weight: 600;
  }

  & .${classes.lyhenne} {
    align-self: center;
  }

  & .${classes.ndashContainer} {
    display: flex;
    justify-content: center;
    align-items: end;
  }

  & .${classes.ndash} {
    font-size: 1.5rem;
    margin-bottom: 1.75rem;
  }

  & .${classes.error} {
    color: ${colors.red};
  }

  & .${classes.progressSivupalkki} {
    display: flex;
    gap: 0.2rem;
    margin-bottom: 1rem;
    max-width: 25%;

    &__button {
      max-width: 100%;
      font-size: 0.75rem;
      line-height: 1rem;
      color: ${colors.black};

      &[data-current] {
        background-color: ${colors.brightGreenBg};
      }

      &[data-past] {
        background-color: ${colors.lightGrayishGreenBg};
      }

      &__icon {
        color: ${colors.brandGreen};
      }
    }
  }

  & .${classes.inputContainer} {
    display: flex;
    gap: 1.5rem;
    margin: 0.5rem 0;
  }

  & .${classes.innerInputContainer} {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Breakpoints */

  ${theme.breakpoints.down('md')} {
    & .${classes.inputContainer} .${classes.innerInputContainer} {
      flex-basis: content;
      min-width: 40%;
    }

    & .${classes.question} {
      &__container {
        margin: 0 1rem;
      }
    }
  }

  ${theme.breakpoints.down('sm')} {
    & .${classes.container} {
      flex-direction: column;
    }

    & .${classes.question} {
      &__option {
        width: 100%;
      }

      &__container {
        max-width: 100%;
        margin: 0;

        h2 {
          font-size: 1.75rem;
        }
      }
    }

    & .${classes.innerInputContainer} {
      max-width: none;
      flex-basis: content;
    }

    & .${classes.buttonContainer} {
      display: grid;
      grid-template-columns: 25% 25% 25% 25%;
      grid-template-rows: auto;
      grid-template-areas:
        "next next next next"
        "previous previous previous previous"
        "results results results results";
      gap: 0.5rem;
      margin: 1rem 0;

      &__previous {
        width: 100%;
      }
   }
`;
});
