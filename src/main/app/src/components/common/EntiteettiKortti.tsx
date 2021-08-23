import React from 'react';

import {
  Hidden,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  GridDirection,
} from '@material-ui/core';
import DirectionsOutlinedIcon from '@material-ui/icons/DirectionsOutlined';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { colors, educationTypeColorCode } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
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
    '& *': {
      marginTop: 0,
    },
  },
  erityisopetusHeader: {
    color: colors.brandGreen,
    fontWeight: 600,
  },
  icon: {
    verticalAlign: 'text-bottom',
    marginRight: '10px',
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
  iconTexts: Array<IconText>;
  logoElement?: React.ReactNode;
  wrapDirection?: GridDirection;
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
  wrapDirection = 'column',
}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const isSmallOrBigger = useMediaQuery(theme.breakpoints.up('sm'));

  const kuvaus = _.truncate(kuvausProp, { length: 255 }) || t('haku.ei_kuvausta');

  return (
    <LocalizedLink underline="none" component={RouterLink} to={to}>
      <Paper
        data-cy={header}
        classes={{ root: classes.paperRoot }}
        style={{
          borderTop: `5px solid ${educationTypeColorCode[koulutustyyppi]}`,
          padding: isSmallOrBigger ? '20px' : '8px',
        }}>
        <Grid
          container
          direction={isSmallOrBigger ? 'row' : wrapDirection}
          alignItems="center"
          spacing={3}
          style={{ minHeight: '180px', padding: isSmallOrBigger ? '20px' : '8px' }}>
          <Grid
            container
            item
            spacing={isSmallOrBigger ? 3 : 0}
            direction="column"
            xs={12}
            sm>
            <Grid
              item
              container
              direction={isSmallOrBigger ? 'row' : 'column-reverse'}
              justify="space-between"
              spacing={2}>
              <Grid item sm={12}>
                {preHeader && (
                  <Typography
                    className={classes.preHeader}
                    variant="body1"
                    gutterBottom
                    component="div">
                    {preHeader}
                  </Typography>
                )}
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                  {header}
                </Typography>
              </Grid>
            </Grid>

            {erityisopetusHeader && (
              <Grid item>
                <Typography
                  className={classes.erityisopetusHeader}
                  variant="body1"
                  component="div">
                  <DirectionsOutlinedIcon className={classes.icon} />
                  {t('haku.ammatillinenPerustutkintoErityisopetuksena')}
                </Typography>
              </Grid>
            )}

            <Hidden xsDown>
              <Grid item>
                <Typography className={classes.kuvaus} variant="body1" component="div">
                  {sanitizedHTMLParser(kuvaus)}
                </Typography>
              </Grid>
            </Hidden>

            <Grid item container direction="row" style={{ marginTop: 12 }}>
              {iconTexts.map(([content, IconComponent], i) => (
                <Grid item container sm xs={12} key={`header-icon-text-${i}`}>
                  <Typography style={{ display: 'flex', marginRight: '8px' }}>
                    {IconComponent && <IconComponent style={{ marginRight: '8px' }} />}
                    {content}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid
            item
            container
            xs={12}
            sm={3}
            justify={isSmallOrBigger ? 'flex-end' : 'flex-start'}>
            {logoElement}
          </Grid>
        </Grid>
      </Paper>
    </LocalizedLink>
  );
};
