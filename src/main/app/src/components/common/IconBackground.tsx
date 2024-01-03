import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

export const IconBackground = styled('span')<{
  color?: string;
}>(({ color }) => ({
  borderRadius: '50%',
  backgroundColor: color ?? colors.brandGreen,
  padding: '12.5px 15px', // TODO: forced square ratio would be nice but prolly very hard to implement
}));
