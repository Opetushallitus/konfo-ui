import React from 'react';

import { HTMLReactParserOptions } from 'html-react-parser';

import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type StylesProps = Pick<Props, 'noMargin'>;

const classes = {
  html: 'LocalizedHTML',
};

const Root = styled('div')<StylesProps>(({ theme, noMargin }) => ({
  [`&.${classes.html}`]: () => ({
    ...theme.typography.body1,
    ...(noMargin
      ? {}
      : {
          '& p': {
            marginTop: '8px',
            marginBottom: '20px',
          },
        }),
  }),
}));

type Props = {
  data?: Translateable | { nimi: Translateable };
  transform?: HTMLReactParserOptions['transform'];
  defaultValue?: string;
  noWrapper?: boolean;
  noMargin?: boolean;
};

export const LocalizedHTML = ({
  data,
  defaultValue = '',
  transform,
  noWrapper,
  noMargin,
}: Props) => {
  const content =
    sanitizedHTMLParser(localize(data), {
      transform,
    }) || defaultValue;

  return noWrapper ? (
    <>{content}</>
  ) : (
    <Root className={classes.html} noMargin={noMargin}>
      {content}
    </Root>
  );
};
