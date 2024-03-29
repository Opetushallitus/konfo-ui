import React, { useState } from 'react';

import { Grid, Box, Hidden, Paper, useMediaQuery, Link } from '@mui/material';
import { useTheme } from '@mui/system';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';

import Image from '#/src/assets/images/o-EDUCATION-facebook.jpg';
import { colors } from '#/src/colors';
import { OhjaavaHakuLink } from '#/src/components/ohjaava-haku/OhjaavaHakuLink';
import { StyledOutlinedButton } from '#/src/components/OutlinedButton';
import { usePageSectionGap } from '#/src/hooks/usePageSectionGap';
import { styled } from '#/src/theme';

import { Hakupalkki } from './haku/Hakupalkki';
import { useSearch } from './haku/hakutulosHooks';
import { MobileFiltersOnTopMenu } from './haku/MobileFiltersOnTopMenu';
import { RajaaPopoverButton, RajaimetPopover } from './haku/RajaimetPopover';
import { ReactiveBorder } from './ReactiveBorder';

const Root = styled(Box, { name: 'JumpotronRoot' })({
  backgroundImage: `url(${Image})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'block',
});

const JumpotronPaper = styled(Paper, { name: 'JumpotronPaper' })(({ theme }) => ({
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
}));

const JumpotronTitle = styled('h1', { name: 'JumpotronTitle' })(({ theme }) => ({
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

const ShowAllResultsLink = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  return isSmall ? (
    <Link
      href="/haku"
      sx={{ marginTop: '3px', color: 'white', textDecoration: 'underline' }}>
      {children}
    </Link>
  ) : (
    <StyledOutlinedButton
      href="/haku"
      sx={{ fontWeight: 'bold', borderWidth: '2px' }}
      buttoncolor="white"
      inverted={true}>
      {children}
    </StyledOutlinedButton>
  );
};

export const Jumpotron = () => {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isPopoverOpen = Boolean(anchorEl);

  const { koulutusData, isFetching } = useSearch();

  const koulutusFilters = koulutusData?.filters;

  const pageSectionGap = usePageSectionGap();

  return (
    <Root mb={pageSectionGap}>
      <Grid container direction="row" justifyContent="flex-start" alignItems="center">
        <Grid item xs={12} sm={12} md={10} lg={8}>
          <ReactiveBorder>
            <JumpotronPaper>
              <Box>
                <JumpotronTitle>{t('jumpotron.otsikko')}</JumpotronTitle>
              </Box>
              <Box>
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
                  gap="1rem"
                  marginTop={2}>
                  <OhjaavaHakuLink inverted={true} />
                  <ShowAllResultsLink>{t('jumpotron.naytakaikki')}</ShowAllResultsLink>
                  <Hidden mdUp>
                    <MobileFiltersOnTopMenu isButtonInline={true} />
                  </Hidden>
                </Box>
              </Box>
            </JumpotronPaper>
          </ReactiveBorder>
        </Grid>
      </Grid>
    </Root>
  );
};
