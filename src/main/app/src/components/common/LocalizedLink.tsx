import React from 'react';

import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { defaultLanguage, supportedLanguages } from '#/src/tools/i18n';

import { localizeHref } from './localizeHref';

type Props = Omit<RouterLinkProps, 'to'> & {
  href?: string;
};

const UnstyledRouterLink = styled(RouterLink)({
  all: 'unset',
  cursor: 'pointer',
});

export const LocalizedLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ href, ...rest }, ref) => {
    const { i18n } = useTranslation();
    const currentLng = i18n.language;
    const linkLng = supportedLanguages.includes(currentLng)
      ? currentLng
      : defaultLanguage;
    const realTo = localizeHref(href, linkLng);

    return <UnstyledRouterLink ref={ref} to={realTo} {...rest} />;
  }
);
