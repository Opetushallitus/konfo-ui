import DirectionsOutlinedIcon from '@mui/icons-material/DirectionsOutlined';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import {
  Hidden,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  SvgIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { truncate, trim, isEmpty, isUndefined } from 'lodash';
import { useTranslation } from 'react-i18next';

import { colors, educationTypeColorCode } from '#/src/colors';
import { AdditionalInfoWithIcon } from '#/src/components/common/AdditionalInfoWithIcon';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const PREFIX = 'EntiteettiKortti';

const classes = {
  paperRoot: `${PREFIX}-paperRoot`,
  header: `${PREFIX}-header`,
  preHeader: `${PREFIX}-preHeader`,
  kuvaus: `${PREFIX}-kuvaus`,
  erityisopetusHeader: `${PREFIX}-erityisopetusHeader`,
  iconTexts: `${PREFIX}-iconTexts`,
  icon: `${PREFIX}-icon`,
  logo: `${PREFIX}-logo`,
  heading: `${PREFIX}-heading`,
};

const StyledLocalizedLink = styled(LocalizedLink, {
  shouldForwardProp: (prop: string) => !['isSmall', 'wrapIconTexts'].includes(prop),
})<StyledLocalizedLinkProps>(({ theme, isSmall, wrapIconTexts }) => ({
  [`& .${classes.paperRoot}`]: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },

  [`& .${classes.header}`]: {
    marginBottom: theme.spacing(isSmall ? 2 : 3),
    fontWeight: 'bold',
    whiteSpace: 'pre-wrap',
  },

  [`& .${classes.preHeader}`]: {
    color: colors.darkGrey,
    fontWeight: 600,
  },

  // Joillain kuvauksilla on otsikko - estetään turha margin
  [`& .${classes.kuvaus}`]: {
    display: 'inline',
    '& *': {
      marginTop: 0,
    },
    [theme.breakpoints.down('xl')]: {
      maxWidth: 600,
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: 800,
    },
  },

  [`& .${classes.erityisopetusHeader}`]: {
    color: colors.brandGreen,
    fontWeight: 600,
    paddingBottom: '8px',
  },

  [`& .${classes.iconTexts}`]: {
    display: 'flex',
    marginTop: theme.spacing(isSmall ? 2 : 3),
    flexDirection: isSmall ? 'column' : 'row',
    flexWrap: wrapIconTexts ? 'wrap' : 'nowrap',
  },

  [`& .${classes.icon}`]: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
  },

  [`& .${classes.logo}`]: {
    display: 'inline-block',
    position: 'relative',
    float: 'right',
  },

  [`& .${classes.heading}`]: {
    display: 'inline-flex',
  },
}));

// TODO: Jostain syystä TS:n labeled tuples ei toiminut, e.g. IconComponent: (...props: any) => JSX.Element
type IconText = [JSX.Element | string, typeof SvgIcon | undefined];

type StyledLocalizedLinkProps = {
  isSmall?: boolean;
  wrapIconTexts?: boolean;
};

type Props = {
  koulutustyyppi?: string;
  to: string;
  preHeader?: string;
  header: string;
  erityisopetusHeader?: boolean;
  kuvaus?: string;
  iconTexts: Array<IconText | undefined>;
  logoElement?: React.ReactNode;
  teemakuvaElement?: React.ReactNode;
  isSmall?: boolean;
  wrapIconTexts?: boolean;
  jarjestaaUrheilijanAmmKoulutusta?: boolean;
  opintojenLaajuus?: string;
};

export const EntiteettiKortti = ({
  koulutustyyppi = 'amm', // Käytetään vihreää entiteeteille joilla ei ole tyyppiä (e.g. oppilaitos)
  preHeader,
  header,
  erityisopetusHeader,
  kuvaus: kuvausProp,
  iconTexts,
  to,
  logoElement,
  teemakuvaElement,
  isSmall: isSmallProp,
  wrapIconTexts = false,
  jarjestaaUrheilijanAmmKoulutusta = false,
  opintojenLaajuus,
}: Props) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = isSmallProp == null ? smDown : isSmallProp;

  const { t } = useTranslation();

  const kuvaus = isUndefined(kuvausProp)
    ? undefined
    : truncate(kuvausProp, { length: 255 }) || t('haku.ei_kuvausta');

  let erityisopetusHeaderText = '';
  if (erityisopetusHeader && koulutustyyppi === KOULUTUS_TYYPPI.AMM) {
    erityisopetusHeaderText = t('haku.ammatillinen-perustutkinto-erityisopetuksena');
  } else if (erityisopetusHeader && koulutustyyppi === KOULUTUS_TYYPPI.TUVA) {
    erityisopetusHeaderText = t('haku.toteutus-jarjestetaan-erityisopetuksena');
  }

  return (
    <StyledLocalizedLink href={to} wrapIconTexts={wrapIconTexts} isSmall={isSmall}>
      <Paper
        data-testid={header}
        classes={{ root: classes.paperRoot }}
        style={{
          borderTop: `5px solid ${educationTypeColorCode[koulutustyyppi]}`,
          padding: isSmall ? '16px' : '32px',
        }}>
        <Box display="inline-block" width="100%">
          {logoElement && (
            <Box paddingLeft={2} paddingBottom={2} className={classes.logo}>
              {logoElement}
            </Box>
          )}
          {teemakuvaElement && (
            <Hidden smDown>
              <Box
                paddingLeft={2}
                paddingBottom={2}
                className={classes.logo}
                style={{ maxWidth: '50%' }}>
                {teemakuvaElement}
              </Box>
            </Hidden>
          )}
          <Box display="inline">
            {preHeader && (
              <Typography className={classes.preHeader} variant="body1" gutterBottom>
                {preHeader}
              </Typography>
            )}
            <Typography variant="h4" className={classes.header}>
              {trim(
                isEmpty(opintojenLaajuus) ? header : `${header}, ${opintojenLaajuus}`
              )}
            </Typography>
          </Box>

          {erityisopetusHeaderText && (
            <AdditionalInfoWithIcon
              translationKey={erityisopetusHeaderText}
              icon={<DirectionsOutlinedIcon />}
            />
          )}

          {jarjestaaUrheilijanAmmKoulutusta && (
            <AdditionalInfoWithIcon
              translationKey="haku.urheilijan-amm-koulutus"
              icon={<SportsSoccerIcon />}
            />
          )}

          {kuvaus && (
            <Hidden xsDown>
              <Typography component="div" className={classes.kuvaus} variant="body1">
                {sanitizedHTMLParser(kuvaus)}
              </Typography>
            </Hidden>
          )}

          <Box className={classes.iconTexts}>
            {iconTexts.filter(Boolean).map((iconText, i) => {
              const [content, IconComponent] = iconText as IconText;
              return (
                content && (
                  <Box
                    key={`header-icon-text-${i}`}
                    flexBasis="33.33%"
                    flexShrink={1}
                    marginBottom={1}>
                    <Typography
                      style={{
                        display: 'flex',
                        marginRight: '8px',
                      }}>
                      {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                      {content}
                    </Typography>
                  </Box>
                )
              );
            })}
          </Box>
          {teemakuvaElement && (
            <Hidden smUp>
              <Box
                paddingTop={2}
                className={classes.logo}
                style={{
                  display: 'block',
                  position: 'relative',
                  clear: 'both',
                  float: 'left',
                }}>
                {teemakuvaElement}
              </Box>
            </Hidden>
          )}
        </Box>
      </Paper>
    </StyledLocalizedLink>
  );
};
