import { Tooltip } from '@mui/material';
import { includes } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useNotification } from '#/src/hooks/useNotification';
import { useHakuunValitut, useSuosikitSelection } from '#/src/hooks/useSuosikitSelection';
import { BaseSuosikki } from '#/src/types/common';

import { VertailuNotificationContent } from './VertailuNotificationContent';
import { OutlinedCheckboxButton } from '../OutlinedCheckboxButton';

const MAX_HAKUUN_VALITUT = 7;

export const ToggleVieHakulomakkeelleButton = ({
  suosikki,
  data,
}: {
  suosikki: BaseSuosikki;
  data?: Array<BaseSuosikki>;
}) => {
  const { t } = useTranslation();
  const { toggleHaku } = useSuosikitSelection();
  const showNotification = useNotification((state) => state.showNotification);

  const hakuunValitut = useHakuunValitut();

  const hakuunValitutData =
    data?.filter((s) => includes(hakuunValitut, s.hakukohdeOid)) ?? [];

  const allHaveSameHaku = Boolean(
    hakuunValitutData.reduce(
      (resultOid, item) => {
        return resultOid === item.hakuOid ? item.hakuOid : undefined;
      },
      suosikki.hakuOid as string | undefined
    )
  );

  const isSelectedToHaku = includes(hakuunValitut, suosikki.hakukohdeOid);

  const disabledReasons: Array<string> = [];

  if (!suosikki?.hakuAuki) {
    disabledReasons.push(t('suosikit-vertailu.haku-ei-kaynnissa'));
  }
  if (!allHaveSameHaku && suosikki?.hakuOid) {
    disabledReasons.push(
      t('suosikit-vertailu.hakulomakkeella-jo-toisen-haun-hakukohteita')
    );
  }
  if (hakuunValitut.length >= MAX_HAKUUN_VALITUT) {
    disabledReasons.push(
      t('suosikit-vertailu.hakulomakkeelle-voi-vieda-enintaan', {
        max: MAX_HAKUUN_VALITUT,
      })
    );
  }

  const isDisabled = !isSelectedToHaku && disabledReasons.length !== 0;

  return (
    <Tooltip title={isDisabled ? disabledReasons.join('\n') : null} placement="top" arrow>
      <span>
        <OutlinedCheckboxButton
          disabled={isDisabled}
          checked={isSelectedToHaku}
          onClick={() => {
            if (suosikki?.hakukohdeOid) {
              toggleHaku(suosikki?.hakukohdeOid);
              if (!isSelectedToHaku) {
                showNotification({
                  content: <VertailuNotificationContent />,
                  severity: 'success',
                });
              }
            }
          }}>
          {t('suosikit-vertailu.vie-hakulomakkeelle')}
        </OutlinedCheckboxButton>
      </span>
    </Tooltip>
  );
};
