import React from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';

const PREFIX = 'Accordion';

const classes = {
  summary: `${PREFIX}-summary`,
  panel: `${PREFIX}-panel`,
  heading: `${PREFIX}-heading`,
  greenSummaryRoot: `${PREFIX}-greenSummaryRoot`,
  whiteSummaryRoot: `${PREFIX}-whiteSummaryRoot`,
  expanded: `${PREFIX}-expanded`,
  wrapper: `${PREFIX}-wrapper`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.summary}`]: {
    minHeight: '70px',
  },

  [`& .${classes.panel}`]: {
    width: '100%',
    backgroundColor: 'white',
  },

  [`& .${classes.heading}`]: {
    ...theme.typography.body1,
    fontWeight: 600,
  },

  // NOTE: For some reason '&$expanded' as a key did not work when returning values from function hence the two separate styles
  [`& .${classes.greenSummaryRoot}`]: {
    [`&.${classes.expanded}`]: {
      borderBottom: `1px solid ${colors.grey}`,
      backgroundColor: colors.lightGreenBg,
      borderTop: `5px solid ${colors.brandGreen}`,
    },
  },

  [`& .${classes.whiteSummaryRoot}`]: {
    [`&.${classes.expanded}`]: {
      borderBottom: `1px solid ${colors.grey}`,
    },
  },

  [`& .${classes.expanded}`]: {},

  [`& .${classes.wrapper}`]: {
    overflowWrap: 'anywhere',
  },
}));

type Props = {
  items: Array<{ title: string; content: any }>;
  ContentWrapper?: React.FC;
  noColors?: boolean;
};

type ContentWrapperProps = {
  children?: React.ReactNode;
};

const DefaultContentWrapper = ({ children, ...props }: ContentWrapperProps) => {
  return (
    <Typography {...props} component="div" className={classes.wrapper}>
      {children}
    </Typography>
  );
};

export const Accordion = ({
  items,
  noColors,
  ContentWrapper = DefaultContentWrapper,
}: Props) => {
  return (
    <StyledBox maxWidth="800px">
      {items.map((item, i) => (
        <MuiAccordion className={classes.panel} elevation={0} key={i}>
          <AccordionSummary
            classes={{
              root: noColors ? classes.whiteSummaryRoot : classes.greenSummaryRoot,
              expanded: classes.expanded,
            }}
            className={classes.summary}
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}a-content`}
            id={`panel${i}a-header`}>
            <Typography className={classes.heading}>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ContentWrapper>{item.content}</ContentWrapper>
          </AccordionDetails>
        </MuiAccordion>
      ))}
    </StyledBox>
  );
};
