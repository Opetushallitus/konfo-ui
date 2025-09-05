import React from 'react';

import removeMd from 'remove-markdown';

const AT_LEAST_AMOUNT = 200;

export const Preview = ({ markdown }: { markdown?: string }) => {
  const textAsSentences = removeMd(markdown!).match(/[^.!?]+[.!?]+/g);
  return markdown ? (
    <p>
      {textAsSentences!.reduce((paragraph: string, sentence: string) => {
        return paragraph.length < AT_LEAST_AMOUNT &&
          sentence[0].toUpperCase() === sentence[0]
          ? paragraph + sentence
          : paragraph;
      }, '')}
    </p>
  ) : null;
};
