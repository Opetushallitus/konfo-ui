import React, { useState } from 'react';

import { Collapse, Typography } from '@mui/material';

import { colors } from '#/src/colors';
import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { styled } from '#/src/theme';
import { sanitizedHTMLParser } from '#/src/tools/utils';

const StyledHeading = styled(Typography)(() => ({
  fontWeight: 700,
  color: colors.brandGreen,
  cursor: 'pointer',
}));

export const AccordionText = ({ text, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleChange = () => setIsOpen(!isOpen);

  return (
    <div>
      <StyledHeading onClick={handleChange} aria-expanded={isOpen} role="button">
        {title}
        <MaterialIcon
          position="absolute"
          icon={isOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
        />
      </StyledHeading>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <Typography variant="body1" component="div">
          {sanitizedHTMLParser(text)}
        </Typography>
      </Collapse>
    </div>
  );
};
