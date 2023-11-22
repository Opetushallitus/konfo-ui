import React from 'react';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { usePainotettavatOppiaineetLukiossa } from '#/src/components/common/AllLanguagesTooltip/hooks';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { styled } from '#/src/theme';
import { translate } from '#/src/tools/localization';

const Container = styled(Box)({
  ['&']: {
    'margin-left': '0.5rem',
  },
});

type Props = {
  koodiUri: string;
};
export const AllLanguagesTooltip = ({ koodiUri }: Props) => {
  const { t } = useTranslation();
  const koodi = koodiUri.split('#')[0];
  const oppiaineet = usePainotettavatOppiaineetLukiossa();
  const kielet = oppiaineet
    ?.filter(
      (oppiaine) => oppiaine.koodiUri.startsWith(koodi) && oppiaine.koodiUri !== koodi
    )
    .map((kieli) => translate(kieli.nimi));

  return (
    <Container>
      <LabelTooltip
        title={`${t('toteutus.kaikki-kielet-prefix')}: ${kielet?.join(', ')}`}
      />
    </Container>
  );
};
