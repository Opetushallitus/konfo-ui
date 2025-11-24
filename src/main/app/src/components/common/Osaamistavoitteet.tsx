import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { HtmlTextBox } from '#/src/components/common/HtmlTextBox';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

export const Osaamistavoitteet = ({
  osaamistavoitteet: osaamistavoitekuvaus,
  suorittaneenOsaaminen,
}: {
  osaamistavoitteet: Translateable;
  suorittaneenOsaaminen?: Translateable;
}) => {
  const { t } = useTranslation();
  const osaamistavoitteet = isEmpty(osaamistavoitekuvaus)
    ? suorittaneenOsaaminen
    : osaamistavoitekuvaus;

  return isEmpty(osaamistavoitteet) ? null : (
    <HtmlTextBox
      heading={t('koulutus.osaamistavoitteet')}
      html={localize(osaamistavoitteet)}
    />
  );
};
