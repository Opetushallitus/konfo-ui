import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';
import { useTranslation } from 'react-i18next';

import { useContentful } from '#/src/hooks/useContentful';
import { styled } from '#/src/theme';
import { getOne } from '#/src/tools/getOne';
import { ContentfulData } from '#/src/types/ContentfulTypes';
import { ophColors } from '@opetushallitus/oph-design-system';
import { WithSideMargins } from '../WithSideMargins';

const HERO_MAX_WIDTH = 1700;

const HeroWrapper = styled(Box)(({ theme }) => ({
  maxWidth: `${HERO_MAX_WIDTH}px`,
  marginLeft: 'auto',
  marginRight: 'auto',
  color: ophColors.grey900,
  '& p': {
    margin: 0,
    padding: 0,
    fontSize: '18px',
    lineHeight: 1.6,
    [theme.breakpoints.down('md')]: {
      fontSize: '16px',
      lineHeight: 1.4,
    },
  },
}));

const BackgroundImage = styled(Box)<{ backgroundImageUrl?: string }>(
  ({ theme, backgroundImageUrl }) => ({
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundPosition: 'top right',
    backgroundRepeat: 'no-repeat',
    [theme.breakpoints.down('md')]: {
      backgroundSize: '600px',
    },
    [theme.breakpoints.down('sm')]: {
      backgroundSize: '400px',
    },
  })
);

const HeroHeading = styled(Typography)(({ theme }) => ({
  maxWidth: '80%',
  fontSize: '48px',
  margin: 0,
  lineHeight: 1.2,
  paddingTop: theme.spacing(10),
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(8),
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '60%',
    fontSize: '24px',
    paddingTop: theme.spacing(3),
  },
}));

const HeroTextContainer = styled(Box)(({ theme }) => ({
  maxWidth: '70%',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}));

const HorizontalLine = styled('hr')(({ theme }) => ({
  border: 'none',
  width: '65px',
  display: 'inline-block',
  height: '3px',
  backgroundColor: 'green',
  margin: theme.spacing(3, 0),
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(1.5, 0),
    width: '35px',
    height: '2px',
  },
}));

export const HeroImageContent = ({
  contentfulData,
}: {
  contentfulData: ContentfulData;
}) => {
  const theme = useTheme();
  const { assetUrl } = useContentful();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const tutuLaskeutumissivuData = getOne(
    contentfulData?.tutkintojenTunnustaminenLaskeutumissivu
  );
  const heroImageMobile = assetUrl(tutuLaskeutumissivuData?.kuvaMobiili?.url);
  const heroImageDesktop = assetUrl(tutuLaskeutumissivuData?.kuvaDesktop?.url);
  const backgroundImage = isSmallScreen ? heroImageMobile : heroImageDesktop;

  const { t } = useTranslation();

  return (
    <HeroWrapper>
      <BackgroundImage backgroundImageUrl={backgroundImage}>
        <WithSideMargins>
          <HeroTextContainer>
            <HeroHeading variant="h1">{t('tutu-laskeutumissivu.hero-title')}</HeroHeading>
            <HorizontalLine />
            <Typography>{t('tutu-laskeutumissivu.hero-text')}</Typography>
          </HeroTextContainer>
        </WithSideMargins>
      </BackgroundImage>
    </HeroWrapper>
  );
};
