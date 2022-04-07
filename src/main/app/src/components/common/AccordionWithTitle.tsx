import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { Accordion } from '#/src/components/common/Accordion';

import { PageSection } from './PageSection';

const useStyles = makeStyles((theme) => ({
  accordion: {
    width: '50%',
    [theme.breakpoints.down('sm')]: {
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
    <PageSection heading={t(titleTranslationKey)} className={classes.accordion}>
      <Accordion items={data} ContentWrapper={ContentWrapper} />
    </PageSection>
  );
};
