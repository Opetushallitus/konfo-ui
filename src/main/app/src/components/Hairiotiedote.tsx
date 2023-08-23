import { Alert, Link, Stack } from '@mui/material';
import { filter, includes, size } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useContentful } from '#/src/hooks/useContentful';
import { useClosedHairioTiedotteet } from '#/src/store/reducers/appSlice';
import { getOne } from '#/src/tools/getOne';
import { ContentfulHairiotiedote } from '#/src/types/ContentfulTypes';

const HairiotiedoteViesti = (viesti: ContentfulHairiotiedote) => {
  const [closedHairiotiedotteetIds, setClosedHairiotiedotteetIds] =
    useClosedHairioTiedotteet();
  const { alertType, linkkiLisatietoja, name, id } = viesti;
  const { t } = useTranslation();

  return (
    <Alert
      severity={`${alertType ?? 'error'}`}
      onClose={() => setClosedHairiotiedotteetIds([...closedHairiotiedotteetIds, id])}>
      {name}
      {linkkiLisatietoja && (
        <>
          <span> {t('hairiotiedote.lisatietoja')} </span>
          <Link color="inherit" target="_blank" rel="noopener" href={linkkiLisatietoja}>
            {linkkiLisatietoja}
          </Link>
        </>
      )}
    </Alert>
  );
};

export const Hairiotiedote = () => {
  const { data } = useContentful();
  const [closedHairiotiedotteetIds] = useClosedHairioTiedotteet();
  const { hairiotiedote, hairiotiedotteet } = data;
  const hairiotedotteetData = getOne(hairiotiedotteet);
  const openedHairiotiedotteet = filter(
    hairiotedotteetData?.viestit,
    (viesti) => !includes(closedHairiotiedotteetIds, viesti.id)
  );

  return size(openedHairiotiedotteet) > 0 ? (
    <Stack>
      {openedHairiotiedotteet.map((viesti) => {
        const hairioViesti = hairiotiedote[viesti?.id];
        return <HairiotiedoteViesti key={hairioViesti?.name} {...hairioViesti} />;
      })}
    </Stack>
  ) : null;
};
