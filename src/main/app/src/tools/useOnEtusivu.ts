import { useLocation } from 'react-router-dom';

export const useOnEtusivu = () => {
  const { pathname } = useLocation();
  return {
    isAtEtusivu: /^\/[a-z]+\/$/.test(pathname),
  };
};
