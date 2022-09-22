import React from 'react';

import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';

const PREFIX = 'Paluu';

const classes = {
  arrow: `${PREFIX}-arrow`,
  link: `${PREFIX}-link`,
};

const Root = styled('div')({
  paddingTop: '10px',
  paddingBottom: '10px',
  [`& .${classes.arrow}`]: {
    display: 'inline-flex',
    fontSize: '12px',
  },
});

type Props = {
  paluuLinkki: string;
};

export const Paluu = ({ paluuLinkki }: Props) => {
  const { t } = useTranslation();
  return (
    <Root className={classes.link}>
      <LocalizedLink
        component={RouterLink}
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        to={paluuLinkki}>
        <ArrowBackIos className={classes.arrow} />
        {t('lomake.palaa-esittelyyn')}
      </LocalizedLink>
    </Root>
  );
};
