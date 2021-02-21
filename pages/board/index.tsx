import { css } from '@emotion/react';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery, stringify } from 'querystring';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useSWR from 'swr';

import { CircleIconButton, FlexBox } from '../../components/atoms';
import { BaseCard } from '../../components/molecules';
import { Layout } from '../../components/templates/Layout';
import { BOARD_URL, IBoard, ICategory, Paging, useAuth } from '../../shared';
import { useSwr } from '../../shared/hooks/useSwr';

interface Props {
  serverQuery: ParsedUrlQuery;
  initialBoards?: Paging<IBoard>;
}

const initialBoardsKey = BOARD_URL.BASE_BOARD as string;

export const getStaticProps: GetStaticProps = async () => {
  let initialBoards = null;
  await Promise.allSettled([axios.get(initialBoardsKey)]).then(([a]) => {
    initialBoards = a.status === 'fulfilled' ? a.value.data : null;
  });

  return {
    props: {
      initialBoards
    } // will be passed to the page component as props
  };
};

const BoardsPage: NextPage<Props> = ({ initialBoards }) => {
  const [key, setKey] = useState(initialBoardsKey);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { data: boards } = useSwr(key, {
    initialData: initialBoardsKey == key ? initialBoards : undefined,
    revalidateOnMount: true
  });

  const { data: categories } = useSWR<ICategory[]>(BOARD_URL.BASE_CATEGORY);

  const handlePagination = useCallback(
    (page: { selected: number }) => {
      const currentPath = router.pathname;
      const currentQuery = router.query;

      currentQuery.page = String(page.selected);

      router.push({
        pathname: currentPath,
        query: currentQuery
      });
    },
    [router]
  );

  const handleCategoryName = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const currentPath = router.pathname;
      const currentQuery = { ...router.query };

      if (e.target.value === 'all') {
        delete currentQuery.categoryName;
      } else {
        currentQuery.categoryName = e.target.value;
      }

      router.push({
        pathname: currentPath,
        query: currentQuery
      });
    },
    [router]
  );

  const handleChangeKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const handleSubmitKeyword = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const currentPath = router.pathname;
        const currentQuery = router.query;

        currentQuery.keyword = keyword;

        router.push({
          pathname: currentPath,
          query: currentQuery
        });
      }
    },
    [keyword]
  );

  useEffect(() => {
    if (stringify(router.query)) {
      setKey(initialBoardsKey + '?' + stringify(router.query));
    }
  }, [router.query]);

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <FlexBox>
        {categories && (
          <select
            css={css`
              flex: 1;
            `}
            onBlur={handleCategoryName}
            onChange={handleCategoryName}
            defaultValue={router.query.categoryName}>
            <option value={'all'}>All</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        <input
          onChange={handleChangeKeyword}
          value={keyword}
          onKeyPress={handleSubmitKeyword}
          css={css`
            flex: 9;
          `}
        />
      </FlexBox>
      <FlexBox direction={'column'}>
        {boards &&
          boards.content.map((board: IBoard) => (
            <BaseCard
              key={board.boardId}
              id={board.boardId}
              title={board.title}
              author={board.username}
              createdAt={board.createdAt}
              commentCount={0}
              url={`/board/${board.boardId}`}
            />
          ))}
      </FlexBox>
      {boards && (
        <ReactPaginate
          previousLabel={'prev'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          forcePage={boards.pageable.pageNumber}
          pageCount={boards.totalPages ?? 0}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePagination}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
      )}
      {isLoggedIn && (
        <CircleIconButton icon={'AiTwotoneEdit'} color={'#4f4f4f'} onClick={() => router.push('/board/create')} />
      )}
    </Layout>
  );
};

export default BoardsPage;
