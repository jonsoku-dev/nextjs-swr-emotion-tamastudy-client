import { css } from '@emotion/react';
import React from 'react';
import ReactPaginate from 'react-paginate';

import { FlexBox } from '../../atoms';

interface Props {
  totalPages: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

export const Page: React.FC<Props> = ({ totalPages, onPageChange, currentPage }) => {
  return (
    <FlexBox
      css={css`
        .pagination {
          margin: 32px 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 16px;
          align-items: flex-end;
          li {
            cursor: pointer;
            &.active {
              font-size: 1.6rem;
              font-weight: 700;
            }
          }
        }
      `}>
      <ReactPaginate
        previousLabel={'prev'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
        disableInitialCallback={false}
        forcePage={currentPage}
      />
    </FlexBox>
  );
};
