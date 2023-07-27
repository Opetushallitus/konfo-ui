import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion as MuiAccordion, AccordionSummary, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const StyledAccordion = withStyles({
  root: {
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

export const Summary = ({ children }: React.PropsWithChildren) => {
  return (
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content">
      <Typography>{children}</Typography>
    </AccordionSummary>
  );
};

export const Accordion = ({ children }: React.PropsWithChildren) => {
  return children ? <StyledAccordion elevation={0}>{children}</StyledAccordion> : null;
};
