import React from 'react';

import { Link } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';
import { parseUrl } from '#/src/tools/utils';

const PREFIX = 'LinkOrYoutube';

const classes = {
  media: `${PREFIX}-media`,
  container: `${PREFIX}-container`,
  padding: `${PREFIX}-padding`,
};

const StyledLink = styled(Link)({
  [`& .${classes.media}`]: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'block',
    margin: '10px 0px',
  },
  [`& .${classes.container}`]: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden',
  },
  [`& .${classes.padding}`]: {
    paddingTop: '0',
    paddingBottom: '20px',
  },
});

type LinkOrYoutubeProps = React.PropsWithChildren<{
  href: string;
  class: string;
  title: string;
  url: string;
  className: string;
}>;

export const LinkOrYoutube = ({
  children,
  className,
  href,
  ...props
}: LinkOrYoutubeProps) => {
  const url = parseUrl(href);
  const v = url?.searchParams?.get?.('v');

  if (className === 'embedly-card' || props.class === 'embedly-card') {
    return (
      <div className={classes.padding}>
        <div className={classes.container}>
          <iframe
            className={classes.media}
            title={props.title || props.url || href}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed${(v && '/' + v) || url.pathname}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
          />
        </div>
      </div>
    );
  } else {
    const absolute = href.startsWith('http://') || href.startsWith('https://');

    return (
      <StyledLink
        target={absolute ? '_blank' : '_self'}
        rel="noopener"
        {...props}
        href={href}
        underline="always">
        {children}
        {absolute && <MaterialIcon icon="open_in_new" />}
      </StyledLink>
    );
  }
};
