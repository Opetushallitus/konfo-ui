import React from 'react';

import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { StyledButton } from '#/src/components/ohjaava-haku/common/StyledButton';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

const OptionButton = styled(StyledButton)(({ theme }) => ({
  width: '100%',
  justifyContent: 'start',
  backgroundColor: colors.lightGrayishGreenBg,
  color: colors.black,
  paddingLeft: '1rem',
  paddingLight: '1rem',
  textAlign: 'left',

  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },

  '&:hover': {
    backgroundColor: colors.darkerGrayishGreenBg,
  },

  '&[data-selected]': {
    backgroundColor: colors.brandGreen,
    color: colors.white,
  },
}));

export const RajainOption = ({
  id,
  rajainValueIds,
  useRajainOptionNameFromRajain,
  isRajainSelected,
  nimi,
  rajainId,
  toggleAllSelectedRajainValues,
}: {
  id: string;
  rajainValueIds?: Array<string>;
  useRajainOptionNameFromRajain?: boolean;
  isRajainSelected?: boolean;
  nimi?: Translateable;
  rajainId: string;
  toggleAllSelectedRajainValues: (
    rajainId: string,
    rajainValueIds?: Array<string>
  ) => void;
}) => {
  const { t } = useTranslation();

  return (
    <OptionButton
      {...(isRajainSelected && {
        startIcon: <MaterialIcon icon="check" />,
      })}
      key={id}
      onClick={() => toggleAllSelectedRajainValues(rajainId, rajainValueIds)}
      {...(isRajainSelected && { 'data-selected': true })}>
      {useRajainOptionNameFromRajain
        ? localize(nimi)
        : t(`ohjaava-haku.kysymykset.${rajainId}.vaihtoehdot.${id}`)}
    </OptionButton>
  );
};
