import { Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import { localize } from '#/src/tools/localization';

export const VertailuValintakokeet = ({
  valintakokeet,
}: {
  valintakokeet: Array<any>;
}) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {isEmpty(valintakokeet)
        ? t('suosikit-vertailu.ei-valintakokeita')
        : valintakokeet.map((valintakoe) => localize(valintakoe))}
    </Box>
  );
};
