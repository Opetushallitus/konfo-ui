import React from 'react';

import { Box, Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AllLanguagesTooltip } from '#/src/components/common/AllLanguagesTooltip/AllLanguagesTooltip';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS } from '#/src/constants';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { formatDouble, toId } from '#/src/tools/utils';
import { PainotettuArvosana, KoodiUrit } from '#/src/types/HakukohdeTypes';

const PREFIX = 'PainotetutArvosanat';

const classes = {
  table: `${PREFIX}-table`,
  cell: `${PREFIX}-cell`,
};

const StyledGrid = styled(Grid)({
  [`& .${classes.table}`]: {
    borderSpacing: 0,
    borderCollapse: 'separate',
  },
  [`& .${classes.cell}`]: {
    textAlign: 'left',
    maxWidth: '200px',
    padding: '8px',
    verticalAlign: 'top',
  },
});

type Props = {
  arvosanat: Array<PainotettuArvosana>;
};

const getOppiaineName = (koodiUrit: KoodiUrit) => {
  if (koodiUrit) {
    const oppiaineenNimi = localize(koodiUrit.oppiaine.nimi);
    if (koodiUrit.kieli) {
      const kieliPrefix = oppiaineenNimi.match(/^[A-Z]\d/g);
      return `${kieliPrefix} ${localize(koodiUrit.kieli.nimi)}`;
    } else {
      return oppiaineenNimi;
    }
  }
};

export const PainotetutArvosanat = ({ arvosanat }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledGrid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <Box>
        <HeadingBoundary>
          <Heading
            id={toId(t('valintaperuste.painotettavat-oppiaineet'))}
            variant="h2"
            style={{ marginBottom: '8px' }}>
            {t('valintaperuste.painotettavat-oppiaineet')}
          </Heading>
          <Box>
            <table className={classes.table}>
              <tbody>
                <tr>
                  <th className={classes.cell}>{t('valintaperuste.oppiaine')}</th>
                  <th className={classes.cell}>{t('valintaperuste.painokerroin')}</th>
                </tr>
                {arvosanat.map((arvosana, index) => (
                  <tr key={index}>
                    <td className={classes.cell}>{getOppiaineName(arvosana.koodit)}</td>
                    <td className={classes.cell}>
                      {formatDouble(arvosana.painokerroin)}
                    </td>
                    <td>
                      {PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS.includes(
                        arvosana.koodit.oppiaine.koodiUri.split('#')[0]
                      ) && (
                        <AllLanguagesTooltip
                          koodiUri={arvosana.koodit.oppiaine.koodiUri}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </HeadingBoundary>
      </Box>
    </StyledGrid>
  );
};
