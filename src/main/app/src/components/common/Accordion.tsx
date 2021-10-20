import React from 'react';

import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { colors } from '#/src/colors';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  summary: {
    minHeight: '70px',
  },
  panel: {
    width: '100%',
    backgroundColor: 'white',
  },
  heading: {
    ...theme.typography.body1,
    fontWeight: 600,
  },
  // NOTE: For some reason '&$expanded' as a key did not work when returning values from function hence the two separate styles
  greenSummaryRoot: {
    '&$expanded': {
      borderBottom: `1px solid ${colors.grey}`,
      backgroundColor: colors.lightGreenBg,
      borderTop: `5px solid ${colors.brandGreen}`,
    },
  },
  whiteSummaryRoot: {
    '&$expanded': {
      borderBottom: `1px solid ${colors.grey}`,
    },
  },
  expanded: {},
}));

type Props = {
  items: Array<{ title: string; content: any }>;
  ContentWrapper?: React.FC;
  noColors?: boolean;
};

type ContentWrapperProps = {
  children?: React.ReactNode;
};

const DefaultContentWrapper = ({ children, ...props }: ContentWrapperProps) => (
  <Typography {...props} component="div">
    {children}
  </Typography>
);

export const Accordion = ({
  items,
  noColors,
  ContentWrapper = DefaultContentWrapper,
}: Props) => {
  const classes = useStyles({ noColors });
  return (
    <div className={classes.root}>
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
    </div>
  );
};
