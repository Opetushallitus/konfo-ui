import React from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Grid, Icon, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { colors } from '#/src/colors';
import { useContentful } from '#/src/hooks/useContentful';
import { ContentfulAsset, ContentfulLink } from '#/src/types/ContentfulTypes';

const PREFIX = 'LinkCard';

const classes = {
  grid: `${PREFIX}-grid`,
  paper: `${PREFIX}-paper`,
  icon: `${PREFIX}-icon`,
};

const StyledPaper = styled(Paper)({
  height: '110px',
  borderLeft: '4px solid',
  borderLeftColor: colors.brandGreen,
  minWidth: '426px',
  cursor: 'pointer',
  [`& .${classes.grid}`]: {
    height: '100%',
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  [`& .${classes.icon}`]: {
    height: '60px',
    width: '60px',
    backgroundColor: colors.brandGreen,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LinkCard = (props: {
  sivu?: ContentfulLink;
  text?: string;
  icon?: ContentfulAsset;
}) => {
  const { forwardTo, assetUrl } = useContentful();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { icon, text, sivu } = props;
  const url = (icon || {}).url;
  const forwardToPage = (id: string) => {
    navigate(`/${i18n.language}${forwardTo(id)}`);
  };

  return (
    <StyledPaper className={classes.paper} onClick={() => sivu && forwardToPage(sivu.id)}>
      <Grid
        className={classes.grid}
        spacing={3}
        container
        justifyContent="space-between"
        alignItems="center">
        <Grid item xs={2}>
          {url ? (
            <Icon className={classes.icon}>
              <img src={assetUrl(url)} alt={(icon || {}).description} />
            </Icon>
          ) : null}
        </Grid>
        <Grid item xs={9}>
          <Typography align="left" variant="body1">
            {text}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <ArrowForwardIosIcon />
        </Grid>
      </Grid>
    </StyledPaper>
  );
};
