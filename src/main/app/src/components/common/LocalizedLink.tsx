import React from 'react';

import { Link } from '@mui/material';
import { head } from 'lodash';
import { useTranslation } from 'react-i18next';

import { defaultLanguage, supportedLanguages } from '#/src/tools/i18n';

const localizeHref = (href: string, lng: string) =>
  head(href) === '/' ? `/${lng + href}` : `/${lng}/${href}`;

type Props = {
  to: string;
  component?: any;
  children?: React.ReactNode;
  [key: string]: any;
};

export const LocalizedLink = ({ children, to, component, ...rest }: Props) => {
  const { i18n } = useTranslation();
  const currentLng = i18n.language;
  const linkLng = supportedLanguages.includes(currentLng) ? currentLng : defaultLanguage;
  const usedTo = localizeHref(to, linkLng);

  return (
    <Link to={usedTo} {...rest} component={component}>
      {children}
    </Link>
  );
};
