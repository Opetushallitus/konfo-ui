import React from 'react';

import { Box, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';
import Spacer from '#/src/components/common/Spacer';

const useStyles = makeStyles((theme) => ({
  root: { marginTop: '100px' },
  accordion: {
    width: '50%',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
}));

export type AccordionProps = {
  titleTranslationKey: string;
  data: React.ComponentProps<typeof Accordion>['items'];
};

const ContentWrapper: React.FC = ({ children }) => (
  <Typography component="div">{children}</Typography>
);

export const AccordionWithTitle = ({ titleTranslationKey, data }: AccordionProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <Box
      className={clsx([classes.accordion, classes.root])}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t(titleTranslationKey)}</Typography>
      <Spacer />
      <Accordion items={data} ContentWrapper={ContentWrapper} />
    </Box>
  );
};
