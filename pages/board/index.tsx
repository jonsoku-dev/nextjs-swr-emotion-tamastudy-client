import { css } from '@emotion/react';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery, stringify } from 'querystring';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { cache } from 'swr';

import { CircleIconButton, FlexBox } from '../../components/atoms';
import { BaseCard } from '../../components/molecules';
import { Layout } from '../../components/templates/Layout';
import { BOARD_URL, BoardProps, CategoryProps, Paging, useUser } from '../../shared';
import { useSwr } from '../../shared/hooks/useSwr';

interface Props {
  serverQuery: ParsedUrlQuery;
  initialBoards?: Paging<BoardProps>;
  initialCategories?: CategoryProps[];
}

const initialBoardsKey = BOARD_URL.BASE_BOARD as string;
const initialCategoriesKey = BOARD_URL.BASE_CATEGORY as string;

export const getStaticProps: GetStaticProps = async () => {
  let initialBoards = null;
  let initialCategories = null;
  await Promise.allSettled([axios.get(initialBoardsKey), axios.get(initialCategoriesKey)]).then(([a, b]) => {
    initialBoards = a.status === 'fulfilled' ? a.value.data : null;
    initialCategories = b.status === 'fulfilled' ? b.value.data : null;
  });

  // if (!data) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false
  //     }
  //   };
  // }

  return {
    props: {
      initialBoards,
      initialCategories
    } // will be passed to the page component as props
  };
};

const BoardsPage: NextPage<Props> = ({ initialBoards, initialCategories }) => {
  const [key, setKey] = useState(initialBoardsKey);
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const { user } = useUser({
    redirectIfFound: false
  });

  const { data: boards } = useSwr(key, {
    initialData: initialBoardsKey == key ? initialBoards : undefined,
    revalidateOnMount: true
  });

  const { data: categories } = useSwr(BOARD_URL.BASE_CATEGORY, {
    initialData: initialCategories,
    revalidateOnMount: true
  });

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

  console.log(cache);

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
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
            {categories.map((category: CategoryProps) => (
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
          boards.content.map((board: BoardProps) => (
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
      {user.isLoggedIn && (
        <CircleIconButton icon={'AiTwotoneEdit'} color={'#4f4f4f'} onClick={() => router.push('/board/create')} />
      )}
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
//   const initialUser = ctx.req.session.get('initialUser') || null;
//   let initialBoards = null;
//   let initialCategories = null;
//
//   await Promise.allSettled([
//     axios.get(`${BOARD_URL.BASE_BOARD}?${stringify(ctx.query)}`),
//     axios.get(`${BOARD_URL.BASE_CATEGORY}`)
//   ]).then(
//     axios.spread((...response) => {
//       initialBoards = response[0].status === 'fulfilled' ? response[0].value.data : null;
//       initialCategories = response[1].status === 'fulfilled' ? response[1].value.data : null;
//     })
//   );
//
//   return {
//     props: {
//       serverQuery: ctx.query,
//       initialUser,
//       initialBoards,
//       initialCategories
//     }
//   };
// });

export default BoardsPage;
