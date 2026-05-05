import { useEffect, useRef } from 'react';

import { useLocation } from 'react-router-dom';

import { focusElement, scrollToId } from '#/src/tools/utils';

export const useScrollToHash = () => {
  const location = useLocation();
  const lastHash = useRef('');

  useEffect(() => {
    const { hash } = location;
    if (hash) {
      lastHash.current = hash.slice(1); // safe hash for further use after navigation
    }
    if (lastHash.current) {
      const target = document.getElementById(lastHash.current);
      scrollToId(lastHash.current);
      focusElement(target);
      lastHash.current = '';
    }
  }, [location]);
};
