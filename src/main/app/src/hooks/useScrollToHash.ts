import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { focusElement, scrollToId } from '#/src/tools/utils';

export const useScrollToHash = () => {
  const location = useLocation();
  const lastHashRef = useRef('');

  useEffect(() => {
    const { hash } = location;
    if (hash) {
      lastHashRef.current = hash.slice(1); // safe hash for further use after navigation
    }
    if (lastHashRef.current) {
      const target = document.getElementById(lastHashRef.current);
      scrollToId(lastHashRef.current);
      focusElement(target);
      lastHashRef.current = '';
    }
  }, [location]);
};
