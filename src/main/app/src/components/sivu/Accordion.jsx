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

const Summary = ({ children }) => {
  return (
    <AccordionSummary
      elevation={0}
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content">
      <Typography>{children}</Typography>
    </AccordionSummary>
  );
};
const Accordion = ({ children }) => {
  return <StyledAccordion elevation={0}>{children}</StyledAccordion>;
};

export { Summary, Accordion };
