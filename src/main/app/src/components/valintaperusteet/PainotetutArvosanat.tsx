import { Box, Divider, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AllLanguagesTooltip } from '#/src/components/common/AllLanguagesTooltip/AllLanguagesTooltip';
import { Heading, HeadingBoundary } from '#/src/components/Heading';
import { PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS } from '#/src/constants';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';
import { formatDouble, toId } from '#/src/tools/utils';
import { PainotettuArvosana, KoodiUrit } from '#/src/types/HakukohdeTypes';

const Table = styled('table')({
  borderSpacing: 0,
  borderCollapse: 'separate',
});

const cellStyles = {
  textAlign: 'left',
  maxWidth: '200px',
  padding: '8px',
  verticalAlign: 'top',
} as const;

const Td = styled('td')(cellStyles);
const Th = styled('th')(cellStyles);

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
    <Grid item xs={12}>
      <Box py={4}>
        <Divider />
      </Box>
      <Box>
        <HeadingBoundary>
          <Heading
            id={toId(t('valintaperuste.painotettavat-oppiaineet'))}
            variant="h2"
            marginBottom="8px">
            {t('valintaperuste.painotettavat-oppiaineet')}
          </Heading>
          <Box>
            <Table>
              <tbody>
                <tr>
                  <Th>{t('valintaperuste.oppiaine')}</Th>
                  <Th>{t('valintaperuste.painokerroin')}</Th>
                </tr>
                {arvosanat.map((arvosana, index) => (
                  <tr key={index}>
                    <Td>{getOppiaineName(arvosana.koodit)}</Td>
                    <Td>{formatDouble(arvosana.painokerroin)}</Td>
                    <Td>
                      {PAINOTETUT_OPPIAINEET_LUKIO_KAIKKI_OPTIONS.includes(
                        arvosana.koodit.oppiaine.koodiUri.split('#')[0]
                      ) && (
                        <AllLanguagesTooltip
                          koodiUri={arvosana.koodit.oppiaine.koodiUri}
                        />
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        </HeadingBoundary>
      </Box>
    </Grid>
  );
};
