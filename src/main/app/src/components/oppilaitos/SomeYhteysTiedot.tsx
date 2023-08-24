import React from 'react';

import { Grid, Link, Icon } from '@mui/material';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import FacebookIcon from '#/src/assets/images/somelogos/some_facebook.svg';
import InstagramIcon from '#/src/assets/images/somelogos/some_instagram.svg';
import LinkedInIcon from '#/src/assets/images/somelogos/some_linkedin.svg';
import SnapChatIcon from '#/src/assets/images/somelogos/some_snapchat.svg';
import TwitterIcon from '#/src/assets/images/somelogos/some_twitter.svg';
import YoutubeIcon from '#/src/assets/images/somelogos/some_youtube.svg';
import { localize } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';

import { ExternalLinkButton } from '../common/ExternalLinkButton';

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

export const SomeRow = ({ some }: { some: Some }) => (
  <Grid container spacing={1} alignItems="flex-start">
    {some &&
      Object.entries(some)
        .filter(([someKey]) => someKey !== 'sosiaalinenmedia_5')
        .map(([someKey, someUrl]: Array<string>) => (
          <Grid item sm={1} key={`some-${someKey}`}>
            <Link href={someUrl} target="_blank">
              <Icon sx={{ width: '2em', height: '2em' }}>
                <img src={SomeIconLookupTable[someKey]} />
              </Icon>
            </Link>
          </Grid>
        ))}
  </Grid>
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
    <Grid container alignItems="flex-start">
      {hasBlogi && (
        <ExternalLinkButton href={some.sosiaalinenmedia_5} sx={{ marginRight: '1rem' }}>
          {t('oppilaitos.blogi')}
        </ExternalLinkButton>
      )}
      {wwwSivu && (
        <ExternalLinkButton href={localize(wwwSivu?.url)}>
          {isEmpty(wwwSivu.nimi)
            ? t('oppilaitos.oppilaitoksen-www-sivut')
            : localize(wwwSivu)}
        </ExternalLinkButton>
      )}
    </Grid>
  );
};
