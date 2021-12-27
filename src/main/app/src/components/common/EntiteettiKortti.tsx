import React from 'react';

import {
  Hidden,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from '@material-ui/core';
import DirectionsOutlinedIcon from '@material-ui/icons/DirectionsOutlined';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors, educationTypeColorCode } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { KOULUTUS_TYYPPI } from '#/src/constants';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  preHeader: {
    color: colors.darkGrey,
    fontWeight: 600,
  },
  // Joillain kuvauksilla on otsikko - estetään turha margin
  kuvaus: {
    marginBottom: '16px',
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
  erityisopetusHeader: {
    color: colors.brandGreen,
    fontWeight: 600,
    paddingBottom: '8px',
  },
  icon: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
  },
  logo: {
    display: 'inline-block',
    position: 'relative',
    float: 'right',
  },
  heading: {
    display: 'inline-flex',
  },
}));

// TODO: Jostain syystä TS:n labeled tuples ei toiminut, e.g. IconComponent: (...props: any) => JSX.Element
type IconText = [JSX.Element | string, ((...props: any) => JSX.Element) | undefined];

type Props = {
  koulutustyyppi?: string;
  to: string;
  preHeader?: string;
  header: string;
  erityisopetusHeader?: boolean;
  kuvaus: string;
  iconTexts: Array<IconText | undefined | false>;
  logoElement?: React.ReactNode;
  teemakuvaElement?: React.ReactNode;
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
}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const isSmallOrBigger = useMediaQuery(theme.breakpoints.up('sm'));

  const kuvaus = _.truncate(kuvausProp, { length: 255 }) || t('haku.ei_kuvausta');

  let erityisopetusHeaderText = '';
  if (erityisopetusHeader && koulutustyyppi === KOULUTUS_TYYPPI.AMM) {
    erityisopetusHeaderText = t('haku.ammatillinen-perustutkinto-erityisopetuksena');
  } else if (erityisopetusHeader && koulutustyyppi === KOULUTUS_TYYPPI.TUVA) {
    erityisopetusHeaderText = t('haku.toteutus-jarjestetaan-erityisopetuksena');
  }

  const xlDown = useMediaQuery(theme.breakpoints.down('xl'));

  return (
    <LocalizedLink underline="none" component={RouterLink} to={to}>
      <Paper
        data-cy={header}
        classes={{ root: classes.paperRoot }}
        style={{
          borderTop: `5px solid ${educationTypeColorCode[koulutustyyppi]}`,
          padding: isSmallOrBigger ? '20px' : '8px',
        }}>
        <Box display="inline-block" width="100%">
          {logoElement && (
            <Box paddingLeft={2} paddingBottom={2} className={classes.logo}>
              {logoElement}
            </Box>
          )}
          {teemakuvaElement && (
            <Hidden xsDown>
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
            <Typography
              variant="h4"
              style={{
                marginBottom: '16px',
                fontWeight: 'bold',
                whiteSpace: 'pre-wrap',
              }}>
              {header}
            </Typography>
          </Box>

          {erityisopetusHeaderText && (
            <Typography className={classes.erityisopetusHeader} variant="body1">
              <DirectionsOutlinedIcon className={classes.icon} />
              {erityisopetusHeaderText}
            </Typography>
          )}

          <Hidden xsDown>
            <Typography className={classes.kuvaus} variant="body1">
              {sanitizedHTMLParser(kuvaus)}
            </Typography>
          </Hidden>

          <Box display="flex" {...(xlDown ? { flexWrap: 'wrap' } : {})}>
            {iconTexts.filter(Boolean).map((iconText, i) => {
              const [content, IconComponent] = iconText as IconText;
              return (
                <Box key={`header-icon-text-${i}`}>
                  <Typography
                    style={{
                      display: 'flex',
                      marginRight: '8px',
                    }}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {content}
                  </Typography>
                </Box>
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
    </LocalizedLink>
  );
};
