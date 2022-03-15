import { useLayoutEffect } from 'react';
import './chat.css';

const CHAT_SCRIPT_ID = 'oc-start-up';

export const useChat = () => {
  useLayoutEffect(() => {
    var script = document.createElement('script');
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
  }, []);
};
