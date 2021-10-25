import React, { useCallback } from 'react';

import { Box, CssBaseline, makeStyles } from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
import MuiFlatPagination from 'material-ui-flat-pagination';

const useStyles = makeStyles(() => ({
  sizeSmall: {
    padding: '1px 6px',
    margin: '0 4px',
  },

  rootCurrent: {
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'green',
    },
  },
  textPrimary: {
    color: 'white',
  },
  textSecondary: {
    color: 'black',
  },
  text: {
    fontWeight: 'bold',
  },
}));

type PaginationType = { page: number; size: number; offset: number };

type Props = {
  total: number;
  pagination: PaginationType;
  setPagination: (p: PaginationType) => void;
  scrollTargetId?: string;
};

export const TarjontaPagination = ({
  total,
  pagination,
  setPagination,
  scrollTargetId,
}: Props) => {
  const classes = useStyles();

  const { size, offset } = pagination;

  const handleClick = useCallback(
    (e, offset, page) => {
      if (scrollTargetId) {
        document.getElementById(scrollTargetId)?.scrollIntoView();
      }
      setPagination({
        page,
        offset,
        size,
      });
    },
    [setPagination, size, scrollTargetId]
  );

  return total > size ? (
    <Box textAlign="center" marginY={3}>
      <CssBaseline />
      <MuiFlatPagination
        limit={size}
        offset={offset}
        total={total}
        onClick={handleClick}
        classes={classes}
        otherPageColor="secondary"
        currentPageColor="primary"
        size="small"
        previousPageLabel={<ChevronLeftOutlined />}
        nextPageLabel={<ChevronRightOutlined />}
      />
    </Box>
  ) : null;
};
