import React from 'react';

import { Link, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import parse from 'url-parse';

const useStyles = makeStyles({
  media: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'block',
    margin: '10px 0px',
  },
  container: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: '0',
    overflow: 'hidden',
  },
  padding: {
    paddingTop: '0',
    paddingBottom: '20px',
  },
});

export const LinkOrYoutube = ({ children, className, href, ...props }) => {
  const url = parse(href, true);
  const classes = useStyles();
  if (className === 'embedly-card') {
    return (
      <div className={classes.padding}>
        <div className={classes.container}>
          <iframe
            className={classes.media}
            title={props.title || props.url || href}
            width="560"
            height="315"
            src={`https://www.youtube.com/embed${
              (url.query.v && '/' + url.query.v) || url.pathname
            }`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={true}
          />
        </div>
      </div>
    );
  } else {
    return (
      <Link target="_blank" rel="noopener" {...props} href={href} underline={"always"}>
        {children}
        <OpenInNewIcon className={classes.icon} />
      </Link>
    );
  }
};
