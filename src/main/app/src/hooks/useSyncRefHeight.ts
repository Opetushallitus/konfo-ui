import { MutableRefObject, useLayoutEffect } from 'react';

type Target = MutableRefObject<HTMLElement | null>;

// Store all elements per key, so it is easy to retrieve them
const store: Record<string, Array<Target>> = {};

// Triggered when useLayoutEffect is executed on any of the components that use useSyncRefHeight hook
const handleResize = (key: string) => {
  // get all elements with the same key
  const elements = store[key];
  if (elements) {
    let max = 0;

    elements.forEach((element) => {
      // reset min-height, so that we can get the real height of the element
      if (element.current) {
        element.current.style.minHeight = '0px';
        // find the element with highest clientHeight value
        if (element.current.clientHeight > max) {
          max = element.current.clientHeight;
        }
      }
    });
    // update height of all 'joined' elements
    elements.forEach((element) => {
      if (element.current) {
        element.current.style.minHeight = `${max}px`;
      }
    });
  }
};

const resetMinHeight = (ref: Target) => {
  if (ref.current) {
    ref.current.style.minHeight = '0px';
  }
};

// Add element to the store when component is mounted and return cleanup function
const add = (key: string, element: Target) => {
  // create store if missing
  if (!store[key]) {
    store[key] = [];
  }

  store[key].push(element);

  // cleanup function
  return () => {
    const index = store[key].indexOf(element);
    if (index > -1) {
      store[key].splice(index, 1);
    }
  };
};

// Receives multiple elements ([key, element] pairs). This way one hook can be used to handle multiple elements
export type UseSyncRefHeightProps = Array<[string, Target]>;
export const useSyncRefHeight = (
  refs: UseSyncRefHeightProps,
  options: { enabled: boolean } = { enabled: true }
) => {
  useLayoutEffect(() => {
    if (options.enabled) {
      const cleanups: Array<() => void> = [];
      refs.forEach(([key, element]) => {
        // add element ref to store
        cleanups.push(add(key, element));
      });

      const listener = () => {
        refs.forEach(([key]) => {
          handleResize(key);
        });
      };
      listener();
      window.addEventListener('resize', listener);
      return () => {
        cleanups.forEach((cleanup) => cleanup());
        window.removeEventListener('resize', listener);
      };
    } else {
      refs.forEach(([, ref]) => {
        resetMinHeight(ref);
      });
    }
  }, [refs, options]);
};
