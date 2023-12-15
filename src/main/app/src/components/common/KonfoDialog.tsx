import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { castArray } from 'lodash';
import { useTranslation } from 'react-i18next';

import { MaterialIcon } from './MaterialIcon';

type KonfoDialogProps = {
  title: string;
  content: React.ReactNode;
  actions: React.ReactNode;
  onClose: () => void;
} & Omit<DialogProps, 'onClose'>;

export const KonfoDialog = ({
  onClose,
  open,
  title,
  content,
  actions,
  sx,
  ...props
}: KonfoDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      {...props}
      sx={[
        {
          '& .MuiPaper-root': {
            padding: (theme) => theme.spacing(1),
          },
        },
        ...castArray(sx),
      ]}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <DialogTitle variant="h1" sx={{ margin: 0, flexShrink: 1 }}>
          {title}
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
      <DialogContent>{content}</DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 2,
          margin: (theme) => theme.spacing(1),
        }}>
        {actions}
      </DialogActions>
    </Dialog>
  );
};
