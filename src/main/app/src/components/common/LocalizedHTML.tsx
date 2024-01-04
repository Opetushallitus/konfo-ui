import { HTMLReactParserOptions } from 'html-react-parser';

import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { sanitizedHTMLParser } from '#/src/tools/utils';
import { Translateable } from '#/src/types/common';

type Props = {
  data?: Translateable | { nimi: Translateable };
  transform?: HTMLReactParserOptions['transform'];
  defaultValue?: string;
  noWrapper?: boolean;
  noMargin?: boolean;
};

const Root = styled('div')<Pick<Props, 'noMargin'>>(({ theme, noMargin }) => ({
  ...theme.typography.body1,
  ...(noMargin
    ? {}
    : {
        '& p': {
          marginTop: '8px',
          marginBottom: '20px',
        },
      }),
}));

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

  return noWrapper ? <>{content}</> : <Root noMargin={noMargin}>{content}</Root>;
};
