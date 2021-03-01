import { css } from '@emotion/react';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useSWR from 'swr';

import { CircleIconButton, FlexBox } from '../../components/atoms';
import { BaseCard } from '../../components/molecules';
import { Layout } from '../../components/templates/Layout';
import { BoardCategoryDto } from '../../generated-sources/openapi';
import { boardApi, useAuth } from '../../shared';
import { useSwr } from '../../shared/hooks/useSwr';

export const getStaticProps = async () => {
  const { data } = await boardApi.getBoards(
    {
      keyword: '',
      categoryName: ''
    },
    {}
  );

  return {
    props: {
      initialBoards: data
    } // will be passed to the page component as props
  };
};

const BoardsPage = ({ initialBoards }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [key, setKey] = useState('http://localhost:8080/api/v1/board');
  const [keyword, setKeyword] = useState('');
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const { data: boards } = useSwr(key, {
    initialData: '/api/v1/board' == key ? initialBoards : undefined,
    revalidateOnMount: true
  });

  const { data: categories } = useSWR<BoardCategoryDto[]>('http://localhost:8080/api/v1/category');

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
      setKey('/api/v1/board' + '?' + stringify(router.query));
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
          boards.content?.map((board) => (
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
          forcePage={boards?.pageable?.pageNumber}
          pageCount={boards?.totalPages ?? 0}
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
