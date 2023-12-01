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

const PREFIX = 'SisaltoComponent';

const classes = {
  root: `${PREFIX}-root`,
  head: `${PREFIX}-head`,
  body: `${PREFIX}-body`,
};

export const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },

  [`& .${classes.head}`]: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontWeight: 'bold',
  },

  [`& .${classes.body}`]: {
    fontWeight: 'bold',
  },
}));

const StyledTableRow = TableRow;

const HeaderCell = TableCell;

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
    <StyledBox>
      <TableContainer component={Paper}>
        <Table size="small" aria-label={t('valintaperuste.taulukko')}>
          <TableHead>
            <StyledTableRow
              classes={{
                root: classes.root,
              }}>
              {headerRow?.columns.map((col, index) => (
                <HeaderCell
                  key={`cell-${index}`}
                  align="left"
                  classes={{
                    head: classes.head,
                  }}>
                  {localize(col?.text)}
                </HeaderCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {restRows.map(({ isHeader, columns }, index) => {
              const Cell = isHeader ? SubHeaderCell : TableCell;
              return (
                <StyledTableRow
                  key={`row-${index}`}
                  classes={{
                    root: classes.root,
                  }}>
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
    </StyledBox>
  );
};

export const SisaltoComponent = ({ tyyppi, ...props }: Sisalto[0], index: number) => (
  <Box pb={2} key={`sisalto-${index}`}>
    {tyyppi === 'teksti' && <Teksti {...(props as SisaltoTeksti)} />}
    {tyyppi === 'taulukko' && <Taulukko {...(props as SisaltoTaulukko)} />}
  </Box>
);
