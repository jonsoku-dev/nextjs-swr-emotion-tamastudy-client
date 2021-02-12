import deepEqual from 'fast-deep-equal';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery, stringify } from 'querystring';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { Button, FlexBox } from '../../components/atoms';
import { Layout } from '../../components/common';
import { BaseCard, Page } from '../../components/molecules';
import { IBoardPaging, ICategory } from '../../shared/apis';
import { BOARD_URI } from '../../shared/enums';
import { CATEGORY_URI } from '../../shared/enums/category';
import { useUserContext } from '../../shared/hooks';
import { InitialUserProps } from '../_app';

export interface IndexProps extends InitialUserProps {
  serverQuery: ParsedUrlQuery;
  initialBoards: IBoardPaging | null;
  initialCategories: ICategory[] | null;
}

const BoardIndexPage: NextPage<IndexProps> = ({ serverQuery, initialBoards, initialCategories }) => {
  const { query, push, replace } = useRouter();
  const [keyword, setKeyword] = useState(String(serverQuery.keyword) ?? '');
  const [currentPage, setCurrentPage] = useState(Number(serverQuery.page) ?? 0);
  const userContext = useUserContext();

  const { data: boards } = useSWR(BOARD_URI.BASE + '?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? initialBoards : undefined
  });

  const { data: categories } = useSWR(CATEGORY_URI.BASE, {
    dedupingInterval: 15000,
    initialData: initialCategories
  });

  const onClickCreate = useCallback(() => {
    push('/board/create');
  }, []);

  const onChangeKeyword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    },
    [keyword]
  );

  const onKeyDownKeyword = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        replace({
          pathname: '/board',
          query: {
            ...query,
            page: 0,
            keyword
          }
        });
      }
    },
    [keyword]
  );

  const onClickReset = useCallback(() => {
    replace({
      pathname: '/board',
      query: {
        page: 0
      }
    });
    setKeyword('');
  }, [query.keyword]);

  useEffect(() => {
    if (!query.page) {
      replace({
        pathname: '/board',
        query: {
          ...query,
          page: 0
        }
      });
    }
  }, [query.page]);

  useEffect(() => {
    if (query.page) {
      setCurrentPage(Number(query.page));
    }
  }, [query.page]);

  return (
    <Layout title="Home | Next.js + TypeScript Example" {...userContext}>
      {userContext.isLoggedIn && (
        <FlexBox vertical={'space-between'}>
          <input value={keyword} onChange={onChangeKeyword} onKeyPress={onKeyDownKeyword} />
          <Button text={'CREATE'} onClick={onClickCreate} />
        </FlexBox>
      )}
      <FlexBox vertical={'flex-start'} gap={8}>
        {categories?.map((c) => (
          <Button
            colors={{ bg: query.categoryName === c.name ? 'red' : 'black' }}
            key={c.categoryId}
            text={c.name}
            onClick={() =>
              replace({
                pathname: '/board',
                query: {
                  ...query,
                  page: 0,
                  categoryName: c.name
                }
              })
            }
          />
        ))}
        <Button colors={{ bg: 'blue' }} text={'Reset'} onClick={onClickReset} />
      </FlexBox>
      <FlexBox direction={'column'} gap={16}>
        {boards?.content?.map((board) => {
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
      <Page
        totalPages={boards?.totalPages ?? 0}
        onPageChange={({ selected }) => {
          push({
            pathname: '/board',
            query: {
              ...query,
              page: selected.toString()
            }
          });
        }}
        currentPage={currentPage}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (ctx) => {
  const getBoards = await fetch(`${BOARD_URI.BASE}?${ctx.query}`);
  const getCategories = await fetch(`${CATEGORY_URI.BASE}`);
  return {
    props: {
      serverQuery: ctx.query,
      initialBoards: getBoards.ok ? await getBoards.json() : null,
      initialCategories: getCategories.ok ? await getCategories.json() : null
    }
  };
};

export default BoardIndexPage;
