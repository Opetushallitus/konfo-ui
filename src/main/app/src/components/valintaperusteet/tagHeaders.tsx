import { Box, Typography } from '@mui/material';
import {
  DOMNode,
  HTMLReactParserOptions,
  Element as DomElement,
  Text,
} from 'html-react-parser';
import { includes } from 'lodash';

import { toId } from '#/src/tools/utils';

const headers = ['h1', 'h2', 'h3', 'h4', 'h5'] as const;

const checkIsHeader = (tag: string): tag is (typeof headers)[number] =>
  includes(headers, tag);

export const tagHeaders: HTMLReactParserOptions['transform'] = (
  element,
  node: DOMNode
) => {
  if (node instanceof DomElement) {
    const { name } = node;
    if (checkIsHeader(name) && node.children[0] instanceof Text) {
      const text = node.children[0].data;
      const id = toId(text);
      const isH1 = 'h1' === node.name;
      return (
        <Box pt={isH1 ? 0.5 : 0} key={id}>
          <Typography id={id} variant={name}>
            {text}
          </Typography>
        </Box>
      );
    }
  }
  return element;
};
