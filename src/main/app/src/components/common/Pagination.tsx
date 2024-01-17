import { useCallback } from 'react';

import { Box } from '@mui/material';

import { MaterialIcon } from '#/src/components/common/MaterialIcon';
import { MuiFlatPagination } from '#/src/components/MuiFlatPagination';
import { styled } from '#/src/theme';
import { scrollToId } from '#/src/tools/utils';

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
  pagination?: PaginationType;
  setPagination: (p: PaginationType) => void;
  scrollTargetId?: string;
};

export const Pagination = ({
  total,
  pagination,
  setPagination,
  scrollTargetId,
}: Props) => {
  const { size = 0, offset = 0 } = pagination ?? {};

  const handleClick = useCallback(
    (_ev: unknown, newOffset: number) => {
      scrollToId(scrollTargetId, { behavior: 'instant' });
      setPagination({
        offset: newOffset,
        size,
      });
    },
    [setPagination, size, scrollTargetId]
  );

  return total > size ? (
    <StyledBox textAlign="center" marginY={3}>
      <MuiFlatPagination
        limit={size}
        offset={offset}
        total={total}
        onClick={handleClick}
        classes={classes}
        otherPageColor="secondary"
        currentPageColor="primary"
        size="small"
        previousPageLabel={<MaterialIcon icon="chevron_left" />}
        nextPageLabel={<MaterialIcon icon="chevron_right" />}
      />
    </StyledBox>
  ) : null;
};
