import React, { useState } from 'react';

import { Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';
import { sanitizedHTMLParser } from '#/src/tools/utils';

import { MaterialIcon } from './MaterialIcon';

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
          <MaterialIcon name="arrow_drop_up" className={classes.icon} />
        ) : (
          <MaterialIcon name="arrow_drop_down" className={classes.icon} />
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
