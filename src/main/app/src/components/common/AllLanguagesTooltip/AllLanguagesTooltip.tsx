import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { usePainotettavatOppiaineetLukiossa } from '#/src/components/common/AllLanguagesTooltip/hooks';
import { LabelTooltip } from '#/src/components/common/LabelTooltip';
import { translate } from '#/src/tools/localization';

export const AllLanguagesTooltip = ({ koodiUri }: { koodiUri: string }) => {
  const { t } = useTranslation();
  const koodi = koodiUri.split('#')[0];
  const oppiaineet = usePainotettavatOppiaineetLukiossa();
  const kielet = oppiaineet
    ?.filter(
      (oppiaine) => oppiaine?.koodiUri?.startsWith(koodi) && oppiaine.koodiUri !== koodi
    )
    .map((kieli) => translate(kieli.nimi));

  return (
    <Box marginLeft="0.5rem">
      <LabelTooltip
        title={`${t('toteutus.kaikki-kielet-prefix')}: ${kielet?.join(', ')}`}
      />
    </Box>
  );
};
