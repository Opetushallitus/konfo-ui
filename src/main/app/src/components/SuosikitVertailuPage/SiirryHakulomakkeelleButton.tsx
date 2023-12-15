import { useTranslation } from 'react-i18next';

import { ExternalLinkButton } from '#/src/components/common/ExternalLinkButton';
import { BaseSuosikki } from '#/src/types/common';

import { useDialogState } from './SiirryHakulomakkeelleDialog';
import { useSiirryHakulomakkeelleInfo } from './useSiirryHakulomakkeelleInfo';

export const SiirryHakulomakkeelleButton = ({ data }: { data?: Array<BaseSuosikki> }) => {
  const { t } = useTranslation();

  const { isValid, count } = useSiirryHakulomakkeelleInfo(data);

  const { setIsOpen } = useDialogState();

  return (
    <ExternalLinkButton
      disabled={!isValid}
      onClick={() => {
        setIsOpen(true);
      }}>
      {t('suosikit-vertailu.siirry-hakulomakkeelle') +
        ' ' +
        t('suosikit-vertailu.valittu-maara', {
          count,
        })}
    </ExternalLinkButton>
  );
};
