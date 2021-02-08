import deepEqual from 'fast-deep-equal';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { stringify } from 'querystring';
import React, { useCallback, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useSWR from 'swr';

import { Button, FlexBox } from '../../components/atoms';
import { Layout } from '../../components/common';
import { BaseCard } from '../../components/organisms/BaseCard';
import { IBoardPaging } from '../../shared/apis';
import { BOARD_URI } from '../../shared/enums';
import { useUserContext } from '../../shared/hooks';
import { getAsString } from '../../shared/utils/getAsString';
import { InitialUserProps } from '../_app';

export interface IndexProps extends InitialUserProps {
  initialBoards: IBoardPaging | null;
}

const BoardIndexPage: NextPage<IndexProps> = ({ initialBoards }) => {
  const { query, push } = useRouter();
  const [serverQuery] = useState(query);
  const userContext = useUserContext();

  const { data } = useSWR(BOARD_URI.BASE + '?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? initialBoards : undefined
  });

  const onClickCreate = useCallback(() => {
    push('/board/create');
  }, []);

  return (
    <Layout title="Home | Next.js + TypeScript Example" {...userContext}>
      <FlexBox vertical={'flex-end'}>
        <Button text={'CREATE'} onClick={onClickCreate} />
      </FlexBox>
      <div>
        {data?.content?.map((board) => {
          return (
            <BaseCard
              key={board.boardId}
              title={board.title}
              author={board.username}
              commentCount={0}
              url={`/board/${board.boardId}`}
            />
          );
        })}
      </div>
      <ReactPaginate
        previousLabel={'previous'}
        nextLabel={'next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={data?.totalPages || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={(selectedItem) =>
          push({
            pathname: '/board',
            query: {
              page: selectedItem.selected.toString()
            }
          })
        }
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (ctx) => {
  const getBoards = await fetch(`${BOARD_URI.BASE}?page=${getAsString(ctx.query.page ?? '0')}`);
  const initialBoards = getBoards.ok ? await getBoards.json() : null;
  return {
    props: {
      initialBoards
    }
  };
};

export default BoardIndexPage;
