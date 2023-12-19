import React, { useEffect } from 'react';

import { styled } from '#/src/theme';
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

  const buttonStyles = {
    textTransform: 'none',
    transition:
      'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    fontSize: '16px',
    fontWeight: 600,
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    borderRadius: '4px',
    lineHeight: '1.75',
    padding: '8px 16px',
    '&:hover': {
      backgroundColor: 'rgb(40, 85, 11)',
      top: 0,
      left: 0,
    },
  };

  const StyledAskem = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'left',
    width: '80%',
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
    '.askem-plugin': {
      '.askem-header-text': {
        fontSize: '2rem',
        fontWeight: 700,
      },
      '.askem-reactions-group': {
        '.askem-reaction-button': buttonStyles,
      },
      '.askem-inputs': {
        '.askem-form-submit': buttonStyles,
        '.askem-form-submit:not(.disabled)': {
          top: '0 !important',
          left: 'inherit',
        },
      },
    },
  }));

  return (
    <StyledAskem>
      <div className="askem" />
    </StyledAskem>
  );
};
