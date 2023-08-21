import React from 'react';

import { ContentfulLink } from '#/src/types/ContentfulTypes';

import { Uutinen } from './Uutinen';

export const Uutiset = (props: { uutiset: Array<ContentfulLink> }) => (
  <>
    {props.uutiset.map((u, index: number) => (
      <Uutinen id={u.id} key={`uutinen-${index}-${u.id}`} />
    ))}
  </>
);
