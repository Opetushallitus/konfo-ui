import { useEffect, useLayoutEffect, useState } from 'react';

import './chat.css';
import { useLanguageState } from './hooks';

const CHAT_SCRIPT_ID = 'oc-start-up';
const CHAT_WRAPPER_ID = 'ocChat-widget-container';

const useDomQuery = (selector: string) => {
  const [el, setEl] = useState<Element | null>();
  useEffect(() => {
    const newEl = document.querySelector(selector);
    setEl(newEl);
    const observer = new MutationObserver(() => {
      const newEl = document.querySelector(selector);
      setEl(newEl);
    });
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [selector, setEl]);

  return el;
};

export const useChat = () => {
  const [language] = useLanguageState();

  useLayoutEffect(() => {
    if (language === 'fi') {
      const script = document.createElement('script');
      script.setAttribute('id', CHAT_SCRIPT_ID);
      script.setAttribute('data-oc-language', 'fi_FI');
      script.setAttribute(
        'data-main',
        'https://occhat.elisa.fi/chatserver//Scripts/oc-chat'
      );
      script.src = 'https://occhat.elisa.fi/chatserver//Scripts/oc-chat-v2.js';

      if (document.domain === 'opintopolku.fi') {
        script.setAttribute(
          'data-oc-service',
          '0e8747a9-e9c5-4988-bdfb-f52371da5eea-180-88756EB48B5E580FE8993DCDF914B33E8F2DA18D'
        );
      } else {
        // Testi-chat
        script.setAttribute(
          'data-oc-service',
          '0e8747a9-e9c5-4988-bdfb-f52371da5eea-190-5C1C0B86B0B80C7F5F5B33ED4DB1B7A0AA5D2719'
        );
      }

      document.head.appendChild(script);
    }

    return () => {
      const scriptEl = document.getElementById(CHAT_SCRIPT_ID);
      const chatWrapperEl = document.getElementById(CHAT_WRAPPER_ID);
      scriptEl?.remove();
      chatWrapperEl?.remove();
    };
  }, [language]);

  const chatStatusEl = useDomQuery('#oc-chat-status:not(.hidden)');
  const chatWindowEl = useDomQuery('#oc-chat-window:not(.hidden)');

  return Boolean(chatStatusEl || chatWindowEl);
};
