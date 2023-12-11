import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { styled } from '#/src/theme';
import { localize } from '#/src/tools/localization';

import { tagHeaders } from './tagHeaders';
import { Sisalto, SisaltoTaulukko, SisaltoTeksti } from './ValintaperusteTypes';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const HeaderCell = styled(TableCell)({
  backgroundColor: colors.brandGreen,
  color: colors.white,
  fontWeight: 'bold',
});

const SubHeaderCell = TableCell;

const Teksti = ({ data }: SisaltoTeksti) => (
  <Grid item xs={12}>
    <LocalizedHTML data={data} transform={tagHeaders} />
  </Grid>
);

const Taulukko = ({ data: { rows } }: SisaltoTaulukko) => {
  const { t } = useTranslation();
  const [headerRow, ...restRows] = rows;

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small" aria-label={t('valintaperuste.taulukko')}>
          <TableHead>
            <StyledTableRow>
              {headerRow?.columns.map((col, index) => (
                <HeaderCell key={`cell-${index}`} align="left">
                  {localize(col?.text)}
                </HeaderCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {restRows.map(({ isHeader, columns }, index) => {
              const Cell = isHeader ? SubHeaderCell : TableCell;
              return (
                <StyledTableRow key={`row-${index}`}>
                  {columns.map((col, idx) => (
                    <Cell key={`cell-${idx}`} align="left">
                      {localize(col?.text)}
                    </Cell>
                  ))}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export const SisaltoComponent = ({ tyyppi, ...props }: Sisalto[0], index: number) => (
  <Box paddingBottom={2} key={`sisalto-${index}`}>
    {tyyppi === 'teksti' && <Teksti {...(props as SisaltoTeksti)} />}
    {tyyppi === 'taulukko' && <Taulukko {...(props as SisaltoTaulukko)} />}
  </Box>
);
