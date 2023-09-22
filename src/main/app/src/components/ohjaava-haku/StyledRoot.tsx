import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

const PREFIX = 'ohjaava-haku__';

export const classes = {
  question: `${PREFIX}question`,
  question__container: `${PREFIX}question__container`,
  question__option: `${PREFIX}question__option`,
  inputContainer: `${PREFIX}input-container`,
  inputLabel: `${PREFIX}input-label`,
  lyhenne: `${PREFIX}lyhenne`,
  ndash: `${PREFIX}ndash`,
  ndashContainer: `${PREFIX}ndashContainer`,
  error: `${PREFIX}error`,
  kysymysMurupolku: `${PREFIX}kysymysMurupolku`,
  kysymysMurupolku__button: `${PREFIX}kysymysMurupolku__button`,
  kysymysMurupolku__button__icon: `${PREFIX}kysymysMurupolku__button__icon`,
};

export const StyledRoot = styled('div')`
  & .${classes.question} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
    width: 100%;

    &__container {
      margin-left: 2rem;
    }

    &__option {
      justify-content: start;
      background-color: ${colors.lightGrayishGreenBg};
      color: ${colors.black};
      padding-left: 1rem;
      padding-right: 1rem;
      width: 50%;

      &:hover {
        background-color: #a5c291;
      }

      &[data-selected] {
        background-color: ${colors.brandGreen};
        color: ${colors.white};
      }
    }
  }

  & .${classes.inputContainer} {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 0.5rem;
  }

  & .${classes.inputLabel} {
    margin-bottom: 0.5rem;
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
    margin-bottom: 1rem;
  }

  & .${classes.error} {
    color: ${colors.red};
    margin-top: 1rem;
  }

  & .${classes.kysymysMurupolku} {
    display: flex;
    gap: 0.2rem;

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
`;
