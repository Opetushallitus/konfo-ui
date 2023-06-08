import React, { useState } from 'react';

import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import { Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const PREFIX = 'AccordionText';

const classes = {
  heading: `${PREFIX}-heading`,
  icon: `${PREFIX}-icon`,
};

const Root = styled('div')(() => ({
  [`& .${classes.heading}`]: {
    fontWeight: 700,
    color: colors.brandGreen,
    cursor: 'pointer',
  },

  [`& .${classes.icon}`]: {
    position: 'absolute',
  },
}));

export const AccordionText = ({ text, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleChange = () => setIsOpen(!isOpen);

  return (
    <Root>
      <Typography
        className={classes.heading}
        onClick={handleChange}
        aria-expanded={isOpen}
        role={'button'}>
        {title}
        {isOpen ? (
          <ArrowDropUp className={classes.icon} />
        ) : (
          <ArrowDropDown className={classes.icon} />
        )}
      </Typography>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Typography variant="body1" component="div">
          {sanitizedHTMLParser(text)}
        </Typography>
      </Collapse>
    </Root>
  );
};
