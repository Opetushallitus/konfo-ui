import { Alert, Stack } from '@mui/material';
import { includes, isEmpty, size, sortBy } from 'lodash';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import { useContentful } from '#/src/hooks/useContentful';
import { useClosedHairioTiedotteet } from '#/src/store/reducers/appSlice';
import { ContentfulHairiotiedote } from '#/src/types/ContentfulTypes';

const HairiotiedoteViesti = (viesti: ContentfulHairiotiedote) => {
  const [closedHairiotiedotteetIds, setClosedHairiotiedotteetIds] =
    useClosedHairioTiedotteet();
  const { alertType, hairionKuvaus, id } = viesti;
  const { t } = useTranslation();

  return (
    <Alert
      closeText={t('sulje')}
      severity={`${alertType ?? 'error'}`}
      onClose={() => setClosedHairiotiedotteetIds([...closedHairiotiedotteetIds, id])}>
      <Markdown>{hairionKuvaus}</Markdown>
    </Alert>
  );
};

export const Hairiotiedote = () => {
  const { data } = useContentful();
  const [closedHairiotiedotteetIds] = useClosedHairioTiedotteet();
  const { hairiotiedote } = data;

  const opintopolkuHairiotiedotteet = Object.entries(hairiotiedote ?? {})
    ?.map(([_, value]: [string, ContentfulHairiotiedote]) => value)
    .filter((tiedote: ContentfulHairiotiedote) => {
      const whereShown = tiedote?.whereShown;
      if (isEmpty(whereShown)) {
        return false;
      } else {
        return JSON.parse(whereShown).includes('Opintopolku.fi');
      }
    });

  const sortedOpintopolkuHairiotiedotteet = sortBy(opintopolkuHairiotiedotteet, [
    'order',
  ]);
  const openedHairiotiedotteet = sortedOpintopolkuHairiotiedotteet?.filter(
    (tiedote: ContentfulHairiotiedote) => !includes(closedHairiotiedotteetIds, tiedote.id)
  );

  return size(openedHairiotiedotteet) > 0 ? (
    <Stack>
      {openedHairiotiedotteet.map((tiedote: ContentfulHairiotiedote) => {
        return <HairiotiedoteViesti key={tiedote?.id} {...tiedote} />;
      })}
    </Stack>
  ) : null;
};
