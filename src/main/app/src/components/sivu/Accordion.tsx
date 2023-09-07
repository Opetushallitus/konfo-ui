import React from 'react';

import { Accordion as MuiAccordion, AccordionSummary, Typography } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';

const StyledAccordion = styled(MuiAccordion)({
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
});

export const Summary = ({ children }: React.PropsWithChildren) => {
  return (
    <AccordionSummary
      expandIcon={<MaterialIcon icon="expand_more" />}
      aria-controls="panel1a-content">
      <Typography>{children}</Typography>
    </AccordionSummary>
  );
};

export const Accordion = ({ children }: React.PropsWithChildren) => {
  return children ? <StyledAccordion elevation={0}>{children}</StyledAccordion> : null;
};
