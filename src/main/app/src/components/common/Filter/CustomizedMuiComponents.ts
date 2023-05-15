import {
  Checkbox,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemText,
  Slider,
} from '@mui/material';
import { withStyles } from '@mui/styles';

import { colors } from '#/src/colors';

export const KonfoCheckbox = withStyles({
  root: {
    padding: '0 9px 0 9px',
  },
})(Checkbox);

export const SuodatinAccordion = withStyles((theme) => ({
  root: () => ({
    // Piilotetaan default väliviiva (koska sitä ei saa pysymään näkyvissä -> korvattu Dividerilla)
    '&:before': {
      visibility: 'hidden',
    },
  }),
  disabled: {
    // NOTE: Jostain syystä root.disabled yliajaa tämän tärkeysjärjestyksessä -> important
    backgroundColor: colors.white + ' !important',
  },
  // Mobiilirajainlistoissa ei haluta käyttää default marginia
  expanded: {
    [theme.breakpoints.down('md')]: {
      margin: '0 0 16px 0 !important',
    },
  },
}))(Accordion);

export const SuodatinAccordionSummary = withStyles((theme) => ({
  root: {
    minHeight: '56px !important',
    [theme.breakpoints.down('md')]: {
      padding: '0 !important',
    },
  },
  content: {
    margin: '0 !important',
  },
}))(AccordionSummary);

export const SuodatinAccordionDetails = withStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      padding: '0 24px 16px 24px',
    },
    [theme.breakpoints.down('md')]: {
      padding: '0 !important',
    },
  },
}))(AccordionDetails);

export const SuodatinListItemText = withStyles({
  primary: {
    fontSize: 14,
    color: colors.darkGrey,
  },
})(ListItemText);

export const SuodatinMobileChip = withStyles({
  root: {
    borderRadius: 2,
    color: colors.white,
    backgroundColor: colors.brandGreen,
    height: 28,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  label: {
    fontWeight: 600,
  },
})(Chip);

export const SuodatinSlider = withStyles({
  markLabelActive: {
    color: colors.brandGreen,
    fontWeight: 700,
  },
})(Slider);
