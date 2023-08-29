import React from 'react';

import { Grid, Link, Icon, Box } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import FacebookIcon from '#/src/assets/images/somelogos/some_facebook.svg';
import InstagramIcon from '#/src/assets/images/somelogos/some_instagram.svg';
import LinkedInIcon from '#/src/assets/images/somelogos/some_linkedin.svg';
import SnapChatIcon from '#/src/assets/images/somelogos/some_snapchat.svg';
import TwitterIcon from '#/src/assets/images/somelogos/some_x.svg';
import YoutubeIcon from '#/src/assets/images/somelogos/some_youtube.svg';
import { colors } from '#/src/colors';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { ExternalLinkButton } from '../common/ExternalLinkButton';
import { MaterialIcon } from '../common/MaterialIcon';

export type Some = {
  sosiaalinenmedia_1: string;
  sosiaalinenmedia_3: string;
  sosiaalinenmedia_4: string;
  sosiaalinenmedia_5: string;
  sosiaalinenmedia_6: string;
  sosiaalinenmedia_7: string;
  sosiaalinenmedia_8: string;
};

const SomeIconLookupTable: Record<string, string> = {
  sosiaalinenmedia_1: FacebookIcon,
  sosiaalinenmedia_3: LinkedInIcon,
  sosiaalinenmedia_4: TwitterIcon,
  sosiaalinenmedia_6: InstagramIcon,
  sosiaalinenmedia_7: YoutubeIcon,
  sosiaalinenmedia_8: SnapChatIcon,
};

const BLOG_KEY = 'sosiaalinenmedia_5';

const PREFIX = 'some';

const classes = {
  container: `${PREFIX}-container`,
  placeHolder: `${PREFIX}-placeholder`,
  iconLinkContainer: `${PREFIX}-icon-container`,
  icon: `${PREFIX}-icon`,
  iconImage: `${PREFIX}-icon-image`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginTop: '0.3rem',

  [`& .${classes.placeHolder}`]: {
    backgroundColor: colors.brandGreen,
    width: '2.6em',
    height: '2.6em',
    marginTop: '4px',
    paddingLeft: '2px',
    borderRadius: '5px',
    '&:hover, &:focus-within': {
      transition: theme.transitions.create(['filter'], {
        duration: theme.transitions.duration.standard,
      }),
      filter: 'grayscale(1)',
    },
  },
  [`& .${classes.iconLinkContainer}`]: {
    [`& .${classes.icon}`]: {
      width: '2em',
      height: '2em',
      [`& .${classes.iconImage}`]: {
        width: '95%',
        height: '95%',
      },
    },
    '&:hover, &:focus-within': {
      [`& .${classes.iconImage}`]: {
        transition: theme.transitions.create(['filter'], {
          duration: theme.transitions.duration.standard,
        }),
        filter: 'grayscale(0.5) invert(70%)',
      },
    },
  },
}));

const SomeIconWithLink = ({ someKey, someUrl }: { someKey: string; someUrl: string }) => {
  const useDefault = !SomeIconLookupTable[someKey];

  return useDefault ? (
    <Box className={classes.placeHolder}>
      <Link href={someUrl} target="_blank">
        <MaterialIcon icon="groups" fontSize="large" htmlColor="white" />
      </Link>
    </Box>
  ) : (
    <Link
      href={someUrl}
      target="_blank"
      className={classes.iconLinkContainer}
      title={someUrl}>
      <Icon className={classes.icon}>
        <img className={classes.iconImage} src={SomeIconLookupTable[someKey]} />
      </Icon>
    </Link>
  );
};

export const SomeRow = ({ some }: { some: Some }) => (
  <StyledGrid
    className={classes.container}
    container
    spacing={1}
    alignItems="flex-start"
    data-testid="some-links">
    {some &&
      Object.entries(some)
        .filter(([someKey]) => someKey !== BLOG_KEY)
        .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1))
        .map(([someKey, someUrl]: Array<string>) => (
          <Grid item sm={1.6} key={`some-${someKey}`}>
            <SomeIconWithLink someKey={someKey} someUrl={someUrl} />
          </Grid>
        ))}
  </StyledGrid>
);

export const BlogAndWebsite = ({
  some,
  wwwSivu,
}: {
  some: Some | undefined;
  wwwSivu: { nimi: Translateable; url: string } | undefined;
}) => {
  const { t } = useTranslation();
  const hasBlogi = some?.sosiaalinenmedia_5 && some.sosiaalinenmedia_5.length > 0;

  return (
    <StyledGrid
      container
      spacing={1}
      alignItems="flex-start"
      sx={{ marginTop: '0.3rem' }}>
      {hasBlogi && (
        <Grid item sm={5.5}>
          <ExternalLinkButton href={some.sosiaalinenmedia_5}>
            {t('oppilaitos.blogi')}
          </ExternalLinkButton>
        </Grid>
      )}
      {wwwSivu && (
        <Grid item sm={5.5}>
          <ExternalLinkButton href={localize(wwwSivu?.url)}>
            {isEmpty(wwwSivu.nimi)
              ? t('oppilaitos.oppilaitoksen-www-sivut')
              : localize(wwwSivu)}
          </ExternalLinkButton>
        </Grid>
      )}
    </StyledGrid>
  );
};
