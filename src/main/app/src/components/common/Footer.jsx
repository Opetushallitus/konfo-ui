import React from 'react';

import { Link, Typography, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import clsx from 'clsx';
import Markdown from 'markdown-to-jsx';
import { useTranslation } from 'react-i18next';

import OPOLogoFooterFI from '#/src/assets/images/OpetushallitusIcon.svg';
import OPHIconEN from '#/src/assets/images/OPH Logo EN.png';
import OPHIcon from '#/src/assets/images/OPH logo.png';
import OPOLogoFooterEN from '#/src/assets/images/OPO_Logo_Footer_englanti.svg';
import OPOLogoFooterSV from '#/src/assets/images/OPO_Logo_Footer_ruotsi.svg';
import { colors } from '#/src/colors';
import { ImageComponent } from '#/src/components/sivu/ImageComponent';
import { useContentful } from '#/src/hooks/useContentful';
import { getLanguage } from '#/src/tools/localization';

const PREFIX = 'Footer';

const classes = {
  footer: `${PREFIX}-footer`,
  link: `${PREFIX}-link`,
  content: `${PREFIX}-content`,
  hr: `${PREFIX}-hr`,
  ophIcon: `${PREFIX}-ophIcon`,
  icon: `${PREFIX}-icon`,
  spaceOnBorders: `${PREFIX}-spaceOnBorders`,
  smSpaceOnBorders: `${PREFIX}-smSpaceOnBorders`,
};

const Root = styled('footer')({
  [`& .${classes.footer}`]: {
    backgroundColor: colors.white,
    lineHeight: '21px',
  },
  [`& .${classes.link}`]: {
    display: 'block',
    fontSize: '14px',
    lineHeight: '26px',
  },
  [`& .${classes.content}`]: {
    paddingTop: '36px',
    paddingBottom: '36px',
  },
  [`& .${classes.hr}`]: {
    backgroundColor: colors.white,
    width: '100%',
    overflow: 'visible',
    padding: '0',
    border: 'none',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.lightGrey,
    textAlign: 'center',
  },
  [`& .${classes.ophIcon}`]: {
    height: '30px',
    top: '-15px',
    position: 'relative',
    backgroundColor: colors.white,
    padding: '0 68px',
  },
  [`& .${classes.icon}`]: {
    height: '68px',
    top: '-24px',
    position: 'relative',
    backgroundColor: colors.white,
    padding: '0 40px 0 40px',
  },
  [`& .${classes.spaceOnBorders}`]: {
    paddingLeft: 90,
    paddingRight: 90,
  },
  [`& .${classes.smSpaceOnBorders}`]: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export const Footer = () => {
  const { t } = useTranslation();
  const { data } = useContentful();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const single = (entry) => Object.values(entry || {})[0] || {};
  const { content, contentRight, contentCenter, lopputekstit } = single(data.footer);
  const overrides = {
    overrides: {
      img: {
        component: ImageComponent,
      },
      a: {
        component: Link,
        props: {
          className: classes.link,
        },
      },
      p: {
        component: Typography,
        props: {
          variant: 'body1',
          component: 'div',
          paragraph: true,
        },
      },
    },
  };

  const OpintopolkuFooterLogo = () => {
    switch (getLanguage()) {
      case 'fi':
        return OPOLogoFooterFI;
      case 'en':
        return OPOLogoFooterEN;
      case 'sv':
        return OPOLogoFooterSV;
      default:
        return OPOLogoFooterFI;
    }
  };

  const OPHFooterLogo = () => {
    switch (getLanguage()) {
      case 'en':
        return OPHIconEN;
      default:
        return OPHIcon;
    }
  };

  return (
    <Root>
      <div
        className={clsx(
          classes.footer,
          matches ? classes.spaceOnBorders : classes.smSpaceOnBorders
        )}>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.hr}>
              <img
                alt={t('opintopolku.brand')}
                className={classes.ophIcon}
                src={OpintopolkuFooterLogo()}
              />
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          className={classes.content}>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{content || ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{contentCenter || ''}</Markdown>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box lineHeight={'21px'} m={1}>
              <Markdown options={overrides}>{contentRight || ''}</Markdown>
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.hr}>
              <img
                alt={t('opintopolku.brand')}
                className={classes.icon}
                src={OPHFooterLogo()}
              />
            </div>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" className={classes.content}>
          <Grid item xs={12} sm={12} md={8}>
            <Markdown options={overrides}>{lopputekstit || ''}</Markdown>
          </Grid>
        </Grid>
      </div>
    </Root>
  );
};
