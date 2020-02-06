import React, { useState } from 'react';
import { makeStyles, Typography, Paper, Box } from '@material-ui/core';
import { colors } from '../../colors';
import Spacer from './Spacer';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '80%',
    backgroundColor: colors.limeGreenBackground,
  },
  textArea: {
    margin: '60px auto',
    width: '63%',
    ...theme.typography.body1,
  },
  showLink: {
    margin: '0 auto',
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'inline',
    padding: 0,
    margin: '35px 0 0',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: '1.375rem',
    color: '#378703',
    fontFamily: 'Open Sans',
  },
}));

const TextBox = (props) => {
  const { heading, className, text } = props;
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLines = (event) => {
    event.preventDefault();
    setIsExpanded(!isExpanded);
  };
  const reflow = (rleState) => {
    const { clamped } = rleState;
    if (isTruncated !== clamped) {
      setIsTruncated(clamped);
    }
  };
  const classes = useStyles();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />
      <Paper className={classes.paper}>
        <Box className={classes.textArea}>
          <HTMLEllipsis
            unsafeHTML={text}
            maxLine={isExpanded ? 1000 : 10}
            onReflow={reflow}
          />
          {isTruncated || isExpanded ? (
            <div className={classes.showLink}>
              <button className={classes.linkButton} onClick={toggleLines}>
                {isExpanded ? 'Näytä vähemmän' : 'Lue lisää'}
              </button>
            </div>
          ) : null}
        </Box>
      </Paper>
    </Box>
  );
};

export default TextBox;
