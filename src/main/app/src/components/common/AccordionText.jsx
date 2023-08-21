import React, { useState } from 'react';

import { Collapse, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const PREFIX = 'AccordionText';

const classes = {
  heading: `${PREFIX}-heading`,
};

const Root = styled('div')(() => ({
  [`& .${classes.heading}`]: {
    fontWeight: 700,
    color: colors.brandGreen,
    cursor: 'pointer',
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
        role="button">
        {title}
        <MaterialIcon
          position="absolute"
          icon={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
        />
      </Typography>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Typography variant="body1" component="div">
          {sanitizedHTMLParser(text)}
        </Typography>
      </Collapse>
    </Root>
  );
};
