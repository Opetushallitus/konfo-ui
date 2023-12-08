import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TextButton } from '#/src/components/common/TextButton';
import { useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';

import { MaterialIcon } from './common/MaterialIcon';

export const ConfirmSuosikkiRemoveDialog = ({
  hakukohdeOid,
  open,
  onClose,
}: {
  hakukohdeOid: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { removeSuosikit } = useSuosikitSelection();
  const { t } = useTranslation();
  return (
    <Dialog
      fullWidth={true}
      onClose={onClose}
      open={open}
      sx={{
        '& .MuiPaper-root': {
          padding: (theme) => theme.spacing(1),
        },
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <DialogTitle variant="h1" sx={{ margin: 0, flexShrink: 1 }}>
          {t('suosikit.poista-dialog-title')}
        </DialogTitle>
        <IconButton
          aria-label={t('sulje')}
          onClick={onClose}
          sx={{
            flexShrink: 0,
          }}>
          <MaterialIcon icon="close" />
        </IconButton>
      </Box>
      <DialogContent>{t('suosikit.poista-dialog-text')}</DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 2,
          margin: (theme) => theme.spacing(1),
        }}>
        <Button variant="contained" onClick={() => removeSuosikit(hakukohdeOid)}>
          {t('suosikit.poista')}
        </Button>
        <TextButton onClick={onClose}>{t('peruuta')}</TextButton>
      </DialogActions>
    </Dialog>
  );
};
