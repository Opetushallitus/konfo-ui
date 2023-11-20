import { useLayoutEffect } from 'react';

import { useMeasure } from 'react-use';

import { useHakutulosWidth } from '#/src/store/reducers/appSlice';

export const useSyncHakutulosWidth = () => {
  const [hakutulosRef, { width: realHakutulosWidth }] = useMeasure();

  const [, setHakutulosWidth] = useHakutulosWidth();
  useLayoutEffect(() => {
    setHakutulosWidth(Math.round(realHakutulosWidth));
  }, [realHakutulosWidth, setHakutulosWidth]);

  return hakutulosRef;
};
