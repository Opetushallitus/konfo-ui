import React from 'react';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export const LinkOrYoutube = ({ children, className, href, ...props }) => {
  const url = parseUrl(href);
  const v = url?.searchParams?.get?.('v');

  if (className === 'embedly-card') {
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
    return (
      <StyledLink
        target="_blank"
        rel="noopener"
        {...props}
        href={href}
        underline="always">
        {children}
        <OpenInNewIcon className={classes.icon} />
      </StyledLink>
    );
  }
};
