import React from 'react';

import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { styled } from '#/src/theme';
import { toId } from '#/src/tools/utils';

import { SmartLink } from '../common/SmartLink';

const StyledGrid = styled(Grid, { name: 'Sisallysluettelo' })({
  position: 'sticky',
  alignSelf: 'flex-start',
  height: 'auto',
  top: '90px',
  paddingTop: '30px',
  paddingBottom: '10px',
});

const StyledSmartLink = styled(SmartLink)({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '14px',
  lineHeight: '27px',
  color: colors.brandGreen,
  borderLeftColor: colors.grey500,
  borderLeftWidth: '1px',
  borderLeftStyle: 'solid',
  borderBottomColor: colors.grey500,
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  textDecoration: 'none',
  display: 'block',
  paddingLeft: '21px',
  paddingBottom: '10px',
  paddingTop: '10px',
  '&:last-child': {
    borderBottomStyle: 'none',
  },
});

// NOTE: Tämän voisi varmaan tehdä geneerisesti mutta ehkä selkeämpi näin
type Props = {
  hakukelpoisuusVisible: boolean;
  kuvausVisible: boolean;
  alinHyvaksyttyKeskiarvoVisible: boolean;
  painotetutArvosanatVisible: boolean;
  valintatavatVisible: boolean;
  valintakokeetVisible: boolean;
  lisatiedotVisible: boolean;
  liitteetVisible: boolean;
};

export const Sisallysluettelo = (props: Props) => {
  const { t } = useTranslation();

  const visibleIds = [
    props.hakukelpoisuusVisible && t('valintaperuste.hakukelpoisuus'),
    props.kuvausVisible && t('valintaperuste.kuvaus'),
    props.alinHyvaksyttyKeskiarvoVisible && t('toteutus.alin-hyvaksytty-keskiarvo'),
    props.painotetutArvosanatVisible && t('valintaperuste.painotettavat-oppiaineet'),
    props.valintatavatVisible && t('valintaperuste.valintatavat'),
    props.valintakokeetVisible && t('valintaperuste.valintakokeet'),
    props.lisatiedotVisible && t('valintaperuste.lisatiedot'),
    props.liitteetVisible && t('valintaperuste.liitteet'),
  ].filter(Boolean) as Array<string>;

  return (
    <StyledGrid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={10}>
        {visibleIds.map((name, i) => (
          <StyledSmartLink key={`${name}-${i}`} aria-label={name} href={`#${toId(name)}`}>
            {name}
          </StyledSmartLink>
        ))}
      </Grid>
    </StyledGrid>
  );
};
