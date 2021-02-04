import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import useSWR from 'swr';

import Layout from '../../components/common/Layout';
import { IBoard } from '../../shared/apis';
import { BOARD_URI } from '../../shared/enums';
import { getAsString } from '../../shared/utils/getAsString';
import { InitialUserProps } from '../_app';

interface BoardPageProps extends InitialUserProps {
  boardId: string;
  initialBoard: IBoard | null;
}

const BoardPage: React.FC<BoardPageProps> = ({ boardId, initialBoard }) => {
  const { data } = useSWR(`${BOARD_URI.BASE}/${boardId}`, {
    dedupingInterval: 1500,
    initialData: initialBoard
  });

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <h1>About</h1>
      <p>This is the {boardId} page</p>
      <div>
        <div>
          <p>{data?.title}</p>
          <p>{data?.description}</p>
          <p>{data?.user.email}</p>
        </div>
        <Link href="/board">
          <a>Go to Board</a>
        </Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async (ctx) => {
  const boardId = getAsString(ctx.query.id || '');
  const [getBoard] = await Promise.all([fetch(`${BOARD_URI.BASE}/${boardId}`)]);

  return {
    props: {
      boardId,
      initialBoard: getBoard.ok ? await getBoard.json() : null
    }
  };
};

export default BoardPage;
