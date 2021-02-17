import { css } from '@emotion/react';
import axios from 'axios';
import deepEqual from 'fast-deep-equal';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery, stringify } from 'querystring';
import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { CircleIconButton, FlexBox } from '../../components/atoms';
import { BaseCard } from '../../components/molecules';
import { Layout } from '../../components/templates/Layout';
import {
  BOARD_URL,
  BoardProps,
  CategoryProps,
  Paging,
  useRequest,
  UserProps,
  useUser,
  withSession
} from '../../shared';

interface Props {
  serverQuery: ParsedUrlQuery;
  initialUser?: UserProps;
  initialBoards?: Paging<BoardProps>;
  initialCategories?: CategoryProps[];
}

const BoardsPage: NextPage<Props> = ({ serverQuery, initialUser, initialBoards, initialCategories }) => {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const { user } = useUser({
    redirectIfFound: false,
    initialUser
  });

  const { data: boards } = useRequest<Paging<BoardProps>>(
    {
      url: `${BOARD_URL.BASE_BOARD}?${stringify(router.query)}`
    },
    {
      initialData: deepEqual(router.query, serverQuery) ? initialBoards : undefined
    }
  );

  const { data: categories } = useRequest<CategoryProps[]>(
    {
      url: BOARD_URL.BASE_CATEGORY
    },
    {
      initialData: initialCategories
    }
  );

  const handlePagination = (page: { selected: number }) => {
    const currentPath = router.pathname;
    const currentQuery = router.query;

    currentQuery.page = String(page.selected);

    router.push({
      pathname: currentPath,
      query: currentQuery
    });
  };

  const handleCategoryName = (e: ChangeEvent<HTMLSelectElement>) => {
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
  };

  const handleChangeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleSubmitKeyword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const currentPath = router.pathname;
      const currentQuery = router.query;

      currentQuery.keyword = keyword;

      router.push({
        pathname: currentPath,
        query: currentQuery
      });
    }
  };

  if (!boards) return <div>Loading...</div>;

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
      <FlexBox>
        {categories ? (
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
        ) : (
          <div>Category Loading ...</div>
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
        {boards.content.map((board) => {
          return (
            <BaseCard
              key={board.boardId}
              id={board.boardId}
              title={board.title}
              author={board.username}
              createdAt={board.createdAt}
              commentCount={0}
              url={`/board/${board.boardId}`}
            />
          );
        })}
      </FlexBox>
      <ReactPaginate
        previousLabel={'prev'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        initialPage={boards.pageable.pageNumber}
        pageCount={boards.totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePagination}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      {user.isLoggedIn && (
        <CircleIconButton icon={'AiTwotoneEdit'} color={'#4f4f4f'} onClick={() => router.push('/board/create')} />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
  const initialUser = ctx.req.session.get('initialUser') || null;
  let initialBoards = null;
  let initialCategories = null;

  await Promise.allSettled([
    axios.get(`${BOARD_URL.BASE_BOARD}?${stringify(ctx.query)}`),
    axios.get(`${BOARD_URL.BASE_CATEGORY}`)
  ]).then(
    axios.spread((...response) => {
      initialBoards = response[0].status === 'fulfilled' ? response[0].value.data : null;
      initialCategories = response[1].status === 'fulfilled' ? response[1].value.data : null;
    })
  );

  return {
    props: {
      serverQuery: ctx.query,
      initialUser,
      initialBoards,
      initialCategories
    }
  };
});

export default BoardsPage;
