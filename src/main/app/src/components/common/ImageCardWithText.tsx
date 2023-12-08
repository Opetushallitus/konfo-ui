import { Typography, Box } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const TitleBox = styled(Box)({
  position: 'absolute',
  right: '0%',
  top: '65%',
  transform: 'translate(0, -50%)',
  background: colors.brandGreen,
  color: colors.white,
  padding: '14px 8px 14px 14px',
});

const Image = styled('img')(({ theme }) => ({
  height: '300px',
  width: '300px',
  objectFit: 'cover',
  [theme.breakpoints.down('sm')]: {
    height: '150px',
    width: '100%',
  },
}));

export const ImageCardWithText = (props: { image: string; cardText: string }) => {
  const { image, cardText } = props;
  return (
    <Box position="relative">
      <Image src={image} alt={cardText} />
      <TitleBox display="flex" alignItems="center">
        <Typography height="100%" variant="subtitle1" component="p" color="inherit">
          {cardText}
        </Typography>
        <MaterialIcon icon="chevron_right" sx={{ marginTop: '2px' }} />
      </TitleBox>
    </Box>
  );
};
