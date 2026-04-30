import { Link, LinkProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AccessibleInvisibleText } from '#/src/components/common/accessibility/AccessibleInvisibleText';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';

export const ExternalLink = ({ children, ...props }: LinkProps) => {
  const { t } = useTranslation();

  return (
    <Link target="_blank" rel="noopener" variant="body1" {...props}>
      {children}
      <AccessibleInvisibleText text={` (${t('avautuu-uuteen-valilehteen')})`} />
      <MaterialIcon
        icon="open_in_new"
        aria-hidden="true"
        sx={{
          verticalAlign: 'middle',
          marginLeft: '5px',
          marginBottom: '1px',
        }}
      />
    </Link>
  );
};
