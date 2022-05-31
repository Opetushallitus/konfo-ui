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
  withStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { colors } from '#/src/colors';
import { LocalizedHTML } from '#/src/components/common/LocalizedHTML';
import { localize } from '#/src/tools/localization';
import { toId } from '#/src/tools/utils';

import { Sisalto, SisaltoTaulukko, SisaltoTeksti } from './ValintaperusteTypes';

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const HeaderCell = withStyles(() => ({
  head: {
    backgroundColor: colors.brandGreen,
    color: colors.white,
    fontWeight: 'bold',
  },
}))(TableCell);

const SubHeaderCell = withStyles(() => ({
  body: {
    fontWeight: 'bold',
  },
}))(TableCell);

const headers = ['h1', 'h2', 'h3', 'h4', 'h5'];

const checkIsHeader = (tag: string) => headers.includes(tag);

// TODO: What is node here?
export const tagHeaders = (node: any) => {
  if (checkIsHeader(node.name) && node.children[0]?.data) {
    const text = node.children[0].data;
    const id = toId(text);
    const isH1 = 'h1' === node.name;
    return (
      <Box pt={isH1 ? 0.5 : 0} key={id}>
        <Typography id={id} variant={node.name}>
          {text}
        </Typography>
      </Box>
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
  );
};

export const SisaltoComponent = ({ tyyppi, ...props }: Sisalto[0], index: number) => (
  <Box pb={2} key={`sisalto-${index}`}>
    {tyyppi === 'teksti' && <Teksti {...(props as SisaltoTeksti)} />}
    {tyyppi === 'taulukko' && <Taulukko {...(props as SisaltoTaulukko)} />}
  </Box>
);
