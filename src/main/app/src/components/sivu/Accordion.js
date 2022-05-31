import React from 'react';

import {
  Accordion as MuiAccordion,
  AccordionSummary,
  withStyles,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
