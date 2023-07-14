import React, { useState } from 'react';

import { Grid, Card, CardHeader, CardContent, Box, Hidden } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import Image from '#/src/assets/images/o-EDUCATION-facebook.jpg';
import { colors } from '#/src/colors';

import { LocalizedLink } from './common/LocalizedLink';
import { Hakupalkki } from './haku/Hakupalkki';
import { useSearch } from './haku/hakutulosHooks';
import { MobileFiltersOnTopMenu } from './haku/MobileFiltersOnTopMenu';
import { RajaaPopoverButton, RajaimetPopover } from './haku/RajaimetPopover';
import { ReactiveBorder } from './ReactiveBorder';

const PREFIX = 'Jumpotron';

const classes = {
  callToAction: `${PREFIX}-callToAction`,
  jumpotron: `${PREFIX}-jumpotron`,
  content: `${PREFIX}-content`,
};

const Root = styled('div')(({ theme }) => ({
  backgroundImage: `url(${Image})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'block',

  [`& .${classes.jumpotron}`]: {
    backgroundColor: colors.brandGreen,
    minWidth: 800,
    padding: '50px',
    [theme.breakpoints.down('lg')]: {
      minWidth: 600,
    },
    [theme.breakpoints.down('md')]: {
      minWidth: 200,
      padding: '20px',
    },
  },
}));

const JumpotronTitle = styled('h1')(({ theme }) => ({
  color: colors.white,
  fontSize: '40px',
  fontWeight: 'bold',
  lineHeight: '54px',
  marginTop: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: '22px',
    lineHeight: '30px',
  },
}));

const ShowAllResultsLink = () => {
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <LocalizedLink
      component={RouterLink}
      to="/haku"
      sx={{
        marginTop: '20px',
        color: 'white',
        border: '2px solid white',
        borderRadius: '2px',
        padding: '8px 30px',
        textDecoration: 'none',
        [theme.breakpoints.down('md')]: {
          marginTop: '5px',
          border: 'none',
          textDecoration: 'underline',
          padding: 0,
        },
      }}>
      {t('jumpotron.naytakaikki')}
    </LocalizedLink>
  );
};

export const Jumpotron = () => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);

  const { koulutusData, isFetching } = useSearch();

  const koulutusFilters = koulutusData?.filters;

  return (
    <Root className={classes.callToAction}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center">
        <Grid item xs={12} sm={12} md={10} lg={8}>
          <ReactiveBorder>
            <Card className={classes.jumpotron}>
              <CardHeader
                sx={{ padding: 0 }}
                disableTypography={true}
                title={<JumpotronTitle>{t('jumpotron.otsikko')}</JumpotronTitle>}
              />
              <CardContent sx={{ padding: 0 }}>
                <Hakupalkki
                  rajaaButton={
                    isEmpty(koulutusFilters) ? null : (
                      <RajaaPopoverButton
                        setAnchorEl={setAnchorEl}
                        isPopoverOpen={isPopoverOpen}
                        isLoading={isFetching}
                      />
                    )
                  }
                />
                {!isEmpty(koulutusFilters) && (
                  <RajaimetPopover anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
                )}
                <Box
                  display="flex"
                  flexDirection="row"
                  width="100%"
                  justifyContent="space-between"
                  alignItems="stretch">
                  <ShowAllResultsLink />
                  <Hidden mdUp>
                    <MobileFiltersOnTopMenu isButtonInline={true} />
                  </Hidden>
                </Box>
              </CardContent>
            </Card>
          </ReactiveBorder>
        </Grid>
      </Grid>
    </Root>
  );
};
