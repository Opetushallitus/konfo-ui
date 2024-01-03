import { useTranslation } from 'react-i18next';
import { create } from 'zustand';

import { ExternalLinkButton } from '#/src/components/common/ExternalLinkButton';
import { KonfoDialog } from '#/src/components/common/KonfoDialog';
import { TextButton } from '#/src/components/common/TextButton';
import { VertailuSuosikki } from '#/src/types/common';

import { useSiirryHakulomakkeelleInfo } from './useSiirryHakulomakkeelleInfo';

interface DialogState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDialogState = create<DialogState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) =>
    set((state) => ({
      ...state,
      isOpen,
    })),
}));

export const SiirryHakulomakkeelleDialog = ({
  data,
  open,
  onClose,
}: {
  data?: Array<VertailuSuosikki>;
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useTranslation();
  const { url } = useSiirryHakulomakkeelleInfo(data);
  return (
    <KonfoDialog
      fullWidth={true}
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t('suosikit-vertailu.siirry-hakulomakkeelle-dialog-title')}
      content={t('suosikit-vertailu.siirry-hakulomakkeelle-dialog-text')}
      actions={
        <>
          <ExternalLinkButton href={url} onClick={onClose}>
            {t('suosikit-vertailu.siirry-hakulomakkeelle')}
          </ExternalLinkButton>
          <TextButton onClick={() => onClose()}>{t('peruuta')}</TextButton>
        </>
      }
    />
  );
};
