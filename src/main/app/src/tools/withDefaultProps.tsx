import React from 'react';

// MUI:sta (Emotionista) puuttuu styled-componentsin .attrs
// Tällä voi asettaa oletus-propsit ilman, että tarvii luoda välikomponenttia
export function withDefaultProps<P>(
  Component: React.ComponentType<P>,
  defaultProps: Partial<P>
) {
  return React.forwardRef<React.ComponentRef<React.ComponentType<P>>, P>((props, ref) => (
    <Component {...defaultProps} {...props} ref={ref} />
  ));
}
