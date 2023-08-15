import { Alert, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ContentfulHairiotiedote } from '#/src/types/ContentfulTypes';

export const Hairiotiedote = ({
  hairiotiedote,
  setHairiotiedoteOpen,
}: {
  hairiotiedote?: ContentfulHairiotiedote;
  setHairiotiedoteOpen?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <Alert
      severity={`${hairiotiedote?.alertType ?? 'error'}`}
      onClose={setHairiotiedoteOpen}>
      {hairiotiedote?.alertText}
      {hairiotiedote?.linkkiLisatietoja && (
        <>
          <span> {t('hairiotiedote.lisatietoja')} </span>
          <Link
            color="inherit"
            target="_blank"
            rel="noopener"
            href={hairiotiedote.linkkiLisatietoja}>
            {hairiotiedote.linkkiLisatietoja}
          </Link>
        </>
      )}
    </Alert>
  );
};
