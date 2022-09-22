import React from 'react';

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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { localize } from '#/src/tools/localization';
import { toId } from '#/src/tools/utils';

import { Sisalto, SisaltoTaulukko, SisaltoTeksti } from './ValintaperusteTypes';

const PREFIX = 'SisaltoComponent';

const classes = {
  root: `${PREFIX}-root`,
  head: `${PREFIX}-head`,
  body: `${PREFIX}-body`,
};

const StyledBox = styled(Box)(({ theme }) => ({
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

const headers = ['h1', 'h2', 'h3', 'h4', 'h5'];

const checkIsHeader = (tag: string) => headers.includes(tag);

// TODO: What is node here?
export const tagHeaders = (node: any) => {
  if (checkIsHeader(node.name) && node.children[0]?.data) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <StyledBox pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name}>
          {text}
        </Typography>
      </StyledBox>
    );
  }
};

const Teksti = ({ data }: SisaltoTeksti) => (
  <Grid item xs={12}>
    <LocalizedHTML data={data} transform={tagHeaders} />
  </Grid>
);

const Taulukko = ({ data: { rows } }: SisaltoTaulukko) => {
  const { t } = useTranslation();
  const [headerRow, ...restRows] = rows;

  return (
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
  );
};

export const SisaltoComponent = ({ tyyppi, ...props }: Sisalto[0], index: number) => (
  <Box pb={2} key={`sisalto-${index}`}>
    {tyyppi === 'teksti' && <Teksti {...(props as SisaltoTeksti)} />}
    {tyyppi === 'taulukko' && <Taulukko {...(props as SisaltoTaulukko)} />}
  </Box>
);
