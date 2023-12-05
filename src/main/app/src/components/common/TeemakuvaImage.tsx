import { Card, CardMedia } from '@mui/material';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

export const TeemakuvaImage = ({
  imgUrl,
  altText,
}: {
  imgUrl?: string;
  altText: string;
}) => {
  return (
    <Card sx={{ maxWidth: '1200px' }} elevation={1}>
      <CardMedia
        component="img"
        sx={{
          width: '100%',
          height: 'auto',
        }}
        image={imgUrl || DefaultHeroImage}
        role="img"
        title={altText}
        alt={altText}
      />
    </Card>
  );
};
