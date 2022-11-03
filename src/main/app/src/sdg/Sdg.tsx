import { useLayoutEffect } from 'react';

import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';

import { useContentful } from '#/src/hooks';

interface ParamTypes {
  id: string;
  lng: string;
}

declare global {
  interface Window {
    initMatomoTracker(reInitForSDG: boolean): void;
  }
}

export const installSDGMetaTags = (language: string, content?: string): void => {
  const placeholder = document.getElementById('sdg-analytics-placeholder');
  const installTagsFirstTime = (root: HTMLElement) => {
    const tags = (
      <>
        <meta name="sdg-tag" content="sdg" />
        <meta name="DC.ISO3166" content={language.toUpperCase()} />
        <meta name="DC.Service" content={content} />
        <meta name="policy-code" content="T2" />
        <meta
          name="DC.Policy"
          content="submitting an initial application for admission to public tertiary education institution"
        />
      </>
    );
    console.log('Adding content category meta tags (if not already added): ' + content);
    const parent = document.createElement('div');
    ReactDOM.render(tags, parent, () => {
      root.replaceWith(...Array.from(parent.childNodes));
    });
  };
  const replaceMetaTags = (replaceContent: string) => {
    const langAttribute = 'DC.ISO3166';
    document.head.querySelectorAll(`[name='${langAttribute}']`).forEach((langElement) => {
      langElement.setAttribute('content', language.toUpperCase());
    });
    const contentAttribute = 'DC.Service';
    document.head
      .querySelectorAll(`[name='${contentAttribute}']`)
      .forEach((contentElement) => {
        contentElement.setAttribute('content', replaceContent);
      });
  };

  if (content != null) {
    if (placeholder == null) {
      replaceMetaTags(content);
    } else {
      installTagsFirstTime(placeholder);
    }
    window.initMatomoTracker(true);
  }
};

export const SdgAnalyticTags = () => {
  const { id: slug, lng: lngParam } = useParams<ParamTypes>();
  const { data } = useContentful();
  const { sivu } = data;
  const sdgContentCategory = sivu[slug || '']?.sdgContentCategory;

  useLayoutEffect(() => {
    if (sdgContentCategory) {
      console.log('Got content category: ' + sdgContentCategory);
      installSDGMetaTags(lngParam, sdgContentCategory);
    }
  }, [lngParam, sdgContentCategory]);

  return <></>;
};
