import deepEqual from 'fast-deep-equal';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery, stringify } from 'querystring';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import ReactPaginate from 'react-paginate';

import { FlexBox } from '../../components/atoms';
import { BaseCard } from '../../components/molecules';
import {
  Axios,
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
  useUser({
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
    const currentQuery = router.query;

    currentQuery.categoryName = e.target.value;

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
    <div>
      {categories ? (
        <select onBlur={handleCategoryName} onChange={handleCategoryName} defaultValue={router.query.categoryName}>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      ) : (
        <div>Category Loading ...</div>
      )}
      <input onChange={handleChangeKeyword} value={keyword} onKeyPress={handleSubmitKeyword} />
      <FlexBox direction={'column'} gap={8}>
        {boards.content.map((board) => {
          return (
            <BaseCard
              key={board.boardId}
              id={board.boardId}
              title={board.title}
              author={board.username}
              commentCount={0}
              url={`/board/${board.boardId}`}
            />
          );
        })}
      </FlexBox>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        initialPage={boards.pageable.pageNumber}
        pageCount={boards.totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={4}
        onPageChange={handlePagination}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
  const boardsResponse = await Axios.get(`${BOARD_URL.BASE_BOARD}?${stringify(ctx.query)}`);
  const initialBoards = boardsResponse.data;
  const categoriesResponse = await Axios.get(`${BOARD_URL.BASE_CATEGORY}`);
  const initialCategories = categoriesResponse.data;
  return {
    props: {
      serverQuery: ctx.query,
      initialUser: ctx.req.session.get('initialUser') || null,
      initialBoards: initialBoards || null,
      initialCategories: initialCategories || null
    }
  };
});

export default BoardsPage;
