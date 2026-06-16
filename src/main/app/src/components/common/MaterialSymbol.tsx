import { SvgIconProps, SxProps, Theme } from '@mui/material';
import { isString } from 'lodash';

import { styled } from '#/src/theme';

export type MaterialSymbolVariant = 'filled' | 'outlined';

type MaterialSymbolProps = {
  icon: MaterialSymbolName;
  variant?: MaterialSymbolVariant;
} & Omit<SvgIconProps, 'children'>;

const FONT_SIZE_MAP: Record<string, string> = {
  small: '1.25rem',
  medium: '1.5rem',
  large: '2.1875rem',
  inherit: 'inherit',
};

type MuiPaletteColor = 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const SymbolSpan = styled('span', {
  shouldForwardProp: (prop) =>
    prop !== 'symbolVariant' && prop !== 'symbolSize' && prop !== 'symbolColor',
})<{
  symbolVariant: MaterialSymbolVariant;
  symbolSize: string;
  symbolColor?: string;
}>(({ theme, symbolVariant, symbolSize, symbolColor }) => {
  const themeColor =
    symbolColor && symbolColor in theme.palette
      ? (theme.palette[symbolColor as MuiPaletteColor]?.main ?? symbolColor)
      : symbolColor;
  return {
    fontVariationSettings: symbolVariant === 'filled' ? '"FILL" 1' : '"FILL" 0',
    fontSize: symbolSize,
    color: themeColor,
    verticalAlign: 'middle',
    userSelect: 'none',
    lineHeight: 1,
    width: '1em',
    height: '1em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
});

export const MaterialSymbol = ({
  icon,
  variant = 'outlined',
  fontSize = 'medium',
  htmlColor,
  color,
  className,
  titleAccess,
  sx,
  viewBox: _viewBox,
  shapeRendering: _shapeRendering,
  focusable: _focusable,
  inheritViewBox: _inheritViewBox,
  ...rest
}: MaterialSymbolProps) => {
  const sizeValue =
    isString(fontSize) && fontSize in FONT_SIZE_MAP
      ? FONT_SIZE_MAP[fontSize]
      : String(fontSize);

  const colorValue = htmlColor ?? (color && color !== 'inherit' ? color : undefined);

  const spanProps = rest as unknown as React.HTMLAttributes<HTMLSpanElement>;

  return (
    <SymbolSpan
      symbolVariant={variant}
      symbolSize={sizeValue}
      symbolColor={colorValue}
      className={['material-symbols-outlined', className].filter(Boolean).join(' ')}
      aria-hidden={titleAccess ? undefined : (spanProps['aria-hidden'] ?? true)}
      aria-label={titleAccess ?? spanProps['aria-label']}
      sx={sx as SxProps<Theme>}
      {...spanProps}>
      {icon}
    </SymbolSpan>
  );
};

export const createMaterialSymbol =
  (icon: MaterialSymbolName, variant: MaterialSymbolVariant = 'outlined') =>
  (props: SvgIconProps) => <MaterialSymbol icon={icon} variant={variant} {...props} />;
