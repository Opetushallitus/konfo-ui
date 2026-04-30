import { Button, ButtonProps } from '@mui/material';
import { castArray } from 'lodash';
import { useTranslation } from 'react-i18next';

import { AccessibleInvisibleText } from './accessibility/AccessibleInvisibleText';
import { MaterialIcon } from './MaterialIcon';

type ExternalButtonProps = Pick<
  ButtonProps,
  'sx' | 'children' | 'disabled' | 'onClick' | 'href'
>;

export const ExternalLinkButton = ({
  sx,
  children,
  href,
  disabled,
  onClick,
}: ExternalButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="contained"
      color="primary"
      endIcon={<MaterialIcon icon="open_in_new" aria-hidden="true" />}
      disabled={disabled}
      onClick={onClick}
      sx={[...castArray(sx).filter(Boolean)]}
      {...(href ? { href, rel: 'noopener noreferrer', target: '_blank' } : {})}>
      {children}
      <AccessibleInvisibleText text={` (${t('avautuu-uuteen-valilehteen')})`} />
    </Button>
  );
};
