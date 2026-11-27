import { useTranslation } from 'react-i18next';

import { TextButtonLink, TextButtonLinkProps } from './TextButtonLink';
import { MaterialIcon } from './MaterialIcon';

export type EtusivuLinkProps = Omit<TextButtonLinkProps, 'href' | 'children'>;

export const EtusivuLink = (props: EtusivuLinkProps) => {
  const { t } = useTranslation();

  return (
    <TextButtonLink
      href="/"
      startIcon={<MaterialIcon icon="home" variant="outlined" />}
      {...props}>
      {t('etusivu')}
    </TextButtonLink>
  );
};
