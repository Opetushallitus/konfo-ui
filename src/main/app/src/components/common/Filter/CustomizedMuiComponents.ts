import {
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
} from '@mui/material';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';

export const SuodatinAccordion = styled(Accordion)({
  // Piilotetaan default väliviiva (koska sitä ei saa pysymään näkyvissä -> korvattu Dividerilla)
  '&:before': {
    visibility: 'hidden',
  },
  '&.Mui-disabled': {
    // NOTE: Jostain syystä root.disabled yliajaa tämän tärkeysjärjestyksessä -> important
    backgroundColor: colors.white + ' !important',
  },
});

export const SuodatinAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: '56px !important',
  [theme.breakpoints.down('md')]: {
    padding: '0 !important',
  },
  '.MuiAccordionSummary-content': {
    margin: '0 !important',
  },
}));

export const SuodatinAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    padding: '0 24px 16px 24px',
  },
  [theme.breakpoints.down('md')]: {
    padding: '0 !important',
  },
}));

export const SuodatinMobileChip = styled(Chip)({
  borderRadius: 2,
  color: colors.white,
  backgroundColor: colors.brandGreen,
  height: 28,
  fontSize: '0.9rem',
  cursor: 'pointer',
  fontWeight: 600,
});

export const SuodatinSlider = styled(Slider)({
  '.MuiSlider-markLabelActive': {
    color: colors.brandGreen,
    fontWeight: 700,
  },
  '.MuiSlider-thumb': {
    transition: 'none',
  },
  '.MuiSlider-track': {
    transition: 'none',
  },
});
