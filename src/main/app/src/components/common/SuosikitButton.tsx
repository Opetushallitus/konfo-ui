import { useTranslation } from 'react-i18next';

import { useNonRemovedSuosikitCount } from '#/src/hooks/useSuosikitSelection';

import { SuosikitIcon } from './SuosikitIcon';
import { TextButtonLink, TextButtonLinkProps } from './TextButtonLink';

export const SuosikitButton = ({
  onClick,
  Component = TextButtonLink,
}: {
  onClick?: () => void;
  Component?: React.ComponentType<TextButtonLinkProps>;
}) => {
  const { t } = useTranslation();
  const suosikitCount = useNonRemovedSuosikitCount();

  return suosikitCount > 0 ? (
    <Component href="suosikit" startIcon={<SuosikitIcon />} onClick={() => onClick?.()}>
      {t('suosikit.otsikko')}
    </Component>
  ) : null;
};
