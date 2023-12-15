import {
  AppBar,
  Box,
  Chip,
  CssBaseline,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { urls } from 'oph-urls-js';
import { useTranslation } from 'react-i18next';

import { ReactComponent as OPOLogoEN } from '#/src/assets/images/opintopolku_logo_header_en.svg';
import { ReactComponent as OPOLogoFI } from '#/src/assets/images/opintopolku_logo_header_fi.svg';
import { ReactComponent as OPOLogoSV } from '#/src/assets/images/opintopolku_logo_header_sv.svg';
import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled, theme } from '#/src/theme';
import { getLanguage } from '#/src/tools/localization';

import { LanguageAccordion } from './LanguageAccordion';
import { SuosikitButton } from './SuosikitButton';
import { TextButtonLink } from './TextButtonLink';

const PREFIX = 'Header';

const classes = {
  testi: `${PREFIX}-testi`,
  menuButton: `${PREFIX}-menuButton`,
  menuBox: `${PREFIX}-menuBox`,
  menuText: `${PREFIX}-menuText`,
  toolBar: `${PREFIX}-ToolBar`,
};

const StyledAppBar = styled(AppBar)(() => ({
  position: 'fixed',
  height: theme.headerHeight,
  fontSize: 'small',
  [`& .${classes.toolBar}`]: {
    padding: '0.3rem 0.7rem 0.3rem 1.5rem',
    justifyContent: 'space-between',
  },

  [`& .${classes.testi}`]: {
    color: colors.white,
    fontSize: '11px',
    fontWeight: 800,
    textTransform: 'uppercase',
    borderRadius: 2,
    marginLeft: '20px',
    background: colors.red,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.menuBox}`]: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 'none',
  },

  [`& .${classes.menuText}`]: {
    fontSize: 'small',
    color: colors.white,
  },
}));

const getOpintopolkuHeaderLogo = () => {
  switch (getLanguage()) {
    case 'fi':
      return OPOLogoFI;
    case 'en':
      return OPOLogoEN;
    case 'sv':
      return OPOLogoSV;
    default:
      return OPOLogoFI;
  }
};

const getTestiLabel = () => {
  const hostname = window.location.hostname;
  const environment = hostname.split('opintopolku.fi')?.[0];

  if (hostname === 'localhost') {
    return 'local';
  } else if (environment.length > 0) {
    return environment;
  }
};

export const ToolbarLinkButton = styled(TextButtonLink)({
  display: 'flex',
  flexDirection: 'column',
  color: colors.white,
  textDecoration: 'none',
  flexShrink: 0,
  '&:hover': {
    textDecoration: 'none',
  },
  '& .MuiButton-startIcon': {
    margin: '0 0 1px 0',
  },
  '& .MuiButton-startIcon > svg': {
    fontSize: '26px',
    margin: 0,
  },
});

export const Header = ({
  toggleMenu,
  isOpen,
  refreshSideMenu,
}: {
  toggleMenu: () => void;
  isOpen: boolean;
  refreshSideMenu: () => void;
}) => {
  const { t } = useTranslation();

  const testiLabel = getTestiLabel();
  const showTestiLabel = testiLabel != null;

  const OpintopolkuHeaderLogo = getOpintopolkuHeaderLogo();

  return (
    <>
      <CssBaseline />
      <StyledAppBar>
        <Toolbar className={classes.toolBar}>
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              aria-label={t('avaa-sulje-valikko')}
              onClick={toggleMenu}
              edge="start"
              className={classes.menuButton}>
              <Box className={classes.menuBox}>
                {isOpen ? <MaterialIcon icon="close" /> : <MaterialIcon icon="menu" />}
                <Typography className={classes.menuText}>{t('valikko')}</Typography>
              </Box>
            </IconButton>
            <Link
              sx={{
                '&.Mui-focusVisible': {
                  outline: '1px solid white',
                  outlineOffset: '8px',
                },
              }}
              href="/"
              title={t('header.siirry-etusivulle')}
              onClick={refreshSideMenu}>
              <OpintopolkuHeaderLogo focusable="false" aria-hidden="true" height="26px" />
            </Link>
            {showTestiLabel && (
              <Chip className={classes.testi} size="small" label={testiLabel} />
            )}
          </Box>
          <Hidden smDown>
            <Box display="flex" columnGap={2} marginRight="170px">
              <SuosikitButton Component={ToolbarLinkButton} />
              <ToolbarLinkButton
                href={urls.url('oma-opintopolku')}
                startIcon={<MaterialIcon icon="apps" />}
                sx={{
                  '&.Mui-focusVisible': {
                    outline: '1px solid white',
                  },
                }}
                target="_blank">
                {t('oma-opintopolku')}
              </ToolbarLinkButton>
            </Box>
            <LanguageAccordion />
          </Hidden>
        </Toolbar>
      </StyledAppBar>
    </>
  );
};
