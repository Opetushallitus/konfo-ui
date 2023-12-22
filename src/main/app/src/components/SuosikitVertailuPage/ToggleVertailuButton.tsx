import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useNotifications } from '#/src/hooks/useNotifications';
import {
  useSuosikitSelection,
  useVertailuSuosikit,
} from '#/src/hooks/useSuosikitSelection';

import { VertailuNotificationContent } from './VertailuNotificationContent';
import { OutlinedCheckboxButton } from '../OutlinedCheckboxButton';

const MAX_VERTAILTAVAT = 3;

export const ToggleVertailuButton = ({ oid }: { oid: string }) => {
  const { t } = useTranslation();
  const { toggleVertailu } = useSuosikitSelection();
  const vertailuSuosikit = useVertailuSuosikit();
  const showNotification = useNotifications((state) => state.showNotification);

  const tooltipText =
    vertailuSuosikit.length >= MAX_VERTAILTAVAT
      ? t('suosikit.vertailuun-voi-lisata-enintaan', { max: MAX_VERTAILTAVAT })
      : undefined;

  const isChecked = vertailuSuosikit.includes(oid);

  return (
    <Tooltip title={!isChecked && tooltipText} placement="top" arrow>
      <span>
        <OutlinedCheckboxButton
          checked={isChecked}
          disabled={!isChecked && Boolean(tooltipText)}
          onClick={() => {
            toggleVertailu(oid);
            if (!isChecked) {
              showNotification({
                content: <VertailuNotificationContent />,
                severity: 'success',
              });
            }
          }}>
          {isChecked ? t('suosikit.poista-vertailusta') : t('suosikit.lisaa-vertailuun')}
        </OutlinedCheckboxButton>
      </span>
    </Tooltip>
  );
};
