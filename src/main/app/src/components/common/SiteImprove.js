import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

export const SiteImprove = () => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('previous location:');
    // navigate.;
    // console.log(history.);
    console.log('location:');
    console.log(window.location.href);
  }, [navigate]);

  return null;
};
export default SiteImprove;
