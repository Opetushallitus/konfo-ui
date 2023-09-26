import { Box } from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'ohjaava-haku__';

export const classes = {
  container: `${PREFIX}container`,
  question: `${PREFIX}question`,
  question__container: `${PREFIX}question__container`,
  question__buttonContainer__mobile: `${PREFIX}question__buttonContainer__mobile`,
  question__option: `${PREFIX}question__option`,
  inputContainer: `${PREFIX}input-container`,
  innerInputContainer: `${PREFIX}inner-input-container`,
  inputLabel: `${PREFIX}input-label`,
  lyhenne: `${PREFIX}lyhenne`,
  ndash: `${PREFIX}ndash`,
  ndashContainer: `${PREFIX}ndashContainer`,
  error: `${PREFIX}error`,
  kysymysMurupolku: `${PREFIX}kysymysMurupolku`,
  kysymysMurupolku__button: `${PREFIX}kysymysMurupolku__button`,
  kysymysMurupolku__button__icon: `${PREFIX}kysymysMurupolku__button__icon`,
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

    &__buttonContainer {
      &__mobile {
        display: flex;
        flex-direction: column;
        margin: 1rem 0;
        gap: 0.5rem;
      }
    }

    &__container {
      margin: 0 2rem;
    }

    &__option {
      justify-content: start;
      background-color: ${colors.lightGrayishGreenBg};
      color: ${colors.black};
      padding-left: 1rem;
      padding-right: 1rem;
      width: 60%;

      &:hover {
        background-color: #a5c291;
      }

      &[data-selected] {
        background-color: ${colors.brandGreen};
        color: ${colors.white};
      }
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
    margin-top: 1rem;
  }

  & .${classes.kysymysMurupolku} {
    display: flex;
    gap: 0.2rem;
    margin-bottom: 1rem;

    &__button {
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
  ${theme.breakpoints.down('lg')} {
    & .${classes.question} {
      &__option {
        width: 80%;
      }
    }
  }

  ${theme.breakpoints.down('md')} {
    & .${classes.inputContainer} .${classes.innerInputContainer} {
      flex-basis: content;
      min-width: 40%;
    }

    & .${classes.question} {
      &__option {
        width: 80%;
      }

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
        margin: 0;
      }
    }

    & .${classes.innerInputContainer} {
      max-width: none;
      flex-basis: content;
    }
  }
`;
});
