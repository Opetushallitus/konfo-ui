import React, { useCallback } from 'react';

import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

import MuiFlatPagination from '#/src/components/pagination';

const PREFIX = 'Pagination';

const classes = {
  sizeSmall: `${PREFIX}-sizeSmall`,
  rootCurrent: `${PREFIX}-rootCurrent`,
  textPrimary: `${PREFIX}-textPrimary`,
  textSecondary: `${PREFIX}-textSecondary`,
  text: `${PREFIX}-text`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.sizeSmall}`]: {
    padding: '1px 6px',
    margin: '0 4px',
  },

  [`& .${classes.rootCurrent}`]: {
    backgroundColor: 'green',
    '&:hover': {
      backgroundColor: 'green',
    },
  },

  [`& .${classes.textPrimary}`]: {
    color: 'white',
  },

  [`& .${classes.textSecondary}`]: {
    color: 'black',
  },

  [`& .${classes.text}`]: {
    fontWeight: 'bold',
  },
}));

type PaginationType = { size: number; offset: number };

type Props = {
  total: number;
  pagination: PaginationType;
  setPagination: (p: PaginationType) => void;
  scrollTargetId?: string;
};

export const Pagination = ({
  total,
  pagination,
  setPagination,
  scrollTargetId,
}: Props) => {
  const { size, offset } = pagination;

  const handleClick = useCallback(
    (_ev: unknown, newOffset: number) => {
      if (scrollTargetId) {
        document.getElementById(scrollTargetId)?.scrollIntoView();
      }
      setPagination({
        offset: newOffset,
        size,
      });
    },
    [setPagination, size, scrollTargetId]
  );

  return total > size ? (
    <StyledBox textAlign="center" marginY={3}>
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
    </StyledBox>
  ) : null;
};
