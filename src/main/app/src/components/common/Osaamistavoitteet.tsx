import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { HtmlTextBox } from '#/src/components/common/HtmlTextBox';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

export const Osaamistavoitteet = ({
  osaamistavoitteet,
}: {
  osaamistavoitteet: Translateable;
}) => {
  const { t } = useTranslation();

  return isEmpty(osaamistavoitteet) ? null : (
    <HtmlTextBox
      heading={t('koulutus.osaamistavoitteet')}
      html={localize(osaamistavoitteet)}
    />
  );
};
