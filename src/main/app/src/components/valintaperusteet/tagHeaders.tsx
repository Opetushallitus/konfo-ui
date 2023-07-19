import React from 'react';

import { Typography } from '@mui/material';

import { toId } from '#/src/tools/utils';

import { StyledBox } from './Sisalto';

const headers = ['h1', 'h2', 'h3', 'h4', 'h5'];

const checkIsHeader = (tag: string) => headers.includes(tag);

// TODO: What is node here?
export const tagHeaders = (node: any) => {
  if (checkIsHeader(node.name) && node.children[0]?.data) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <StyledBox pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name}>
          {text}
        </Typography>
      </StyledBox>
    );
  }
};
