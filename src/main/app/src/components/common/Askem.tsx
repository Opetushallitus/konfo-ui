import React, { useEffect } from 'react';

import { getLanguage } from '#/src/tools/localization';

declare const window: Window &
  typeof globalThis & {
    askem: any;
  };

const getApiKey = () => {
  const language = getLanguage();
  console.log('Askem - language: ' + language);
  switch (language) {
    case 'en':
      return 'f554ofogzbqr00jk';
    case 'sv':
      return '2zziejxvzml3uvry';
    default:
      return 'idze486kova0hcrl';
  }
};

const hostnames: Array<string> = ['opintopolku.fi', 'testiopintopolku.fi', 'localhost'];
const enableAskem = (): boolean => {
  const hostname = window.location.hostname;
  console.log('Askem - hostname: ' + hostname);
  return hostnames.includes(hostname);
};

export const Askem = () => {
  useEffect(() => {
    window.askem = {
      settings: {
        apiKey: getApiKey(),
      },
    };

    const script = document.createElement('script');

    script.src = 'https://cdn.askem.com/plugin/askem.js';
    script.async = true;

    if (enableAskem()) document.body.appendChild(script);

    return () => {
      if (enableAskem()) document.body.removeChild(script);
    };
  }, []);

  return <div className="askem"></div>;
};
