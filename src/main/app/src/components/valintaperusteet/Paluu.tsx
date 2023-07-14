import React from 'react';

import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import { Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

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
      <Link
        color="secondary"
        aria-label={t('lomake.palaa-esittelyyn')}
        href={paluuLinkki}>
        <ArrowBackIos className={classes.arrow} />
        {t('lomake.palaa-esittelyyn')}
      </Link>
    </Root>
  );
};
