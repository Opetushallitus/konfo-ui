import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { TextButton } from '#/src/components/common/TextButton';
import { useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';

import { KonfoDialog } from './common/KonfoDialog';

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
    <KonfoDialog
      open={open}
      onClose={onClose}
      title={t('suosikit.poista-dialog-title')}
      content={t('suosikit.poista-dialog-text')}
      actions={
        <>
          <Button variant="contained" onClick={() => removeSuosikit(hakukohdeOid)}>
            {t('suosikit.poista')}
          </Button>
          <TextButton onClick={onClose}>{t('peruuta')}</TextButton>
        </>
      }
    />
  );
};
