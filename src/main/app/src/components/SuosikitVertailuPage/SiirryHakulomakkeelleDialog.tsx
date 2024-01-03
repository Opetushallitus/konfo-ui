import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand';

import { TextButton } from '#/src/components/common/TextButton';
import { VertailuSuosikki } from '#/src/types/common';

import { useSiirryHakulomakkeelleInfo } from './useSiirryHakulomakkeelleInfo';
import { ExternalLinkButton } from '../common/ExternalLinkButton';

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
    <Dialog
      fullWidth={true}
      maxWidth="md"
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiPaper-root': {
          padding: (theme) => theme.spacing(1),
        },
      }}>
      <DialogTitle variant="h1" sx={{ margin: 0 }}>
        {t('suosikit-vertailu.siirry-hakulomakkeelle-dialog-title')}
      </DialogTitle>
      <DialogContent>
        {t('suosikit-vertailu.siirry-hakulomakkeelle-dialog-text')}
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          margin: (theme) => theme.spacing(1),
        }}>
        <ExternalLinkButton href={url} onClick={onClose}>
          {t('suosikit-vertailu.siirry-hakulomakkeelle')}
        </ExternalLinkButton>
        <TextButton onClick={() => onClose()}>{t('peruuta')}</TextButton>
      </DialogActions>
    </Dialog>
  );
};
