import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';

import { CLink } from '../../components/atoms';
import { Layout } from '../../components/common';
import { IBoardPaging } from '../../shared/apis';
import { BOARD_URI } from '../../shared/enums';
import { useBoards, useUserContext } from '../../shared/hooks';
import { InitialUserProps } from '../_app';

export interface IndexProps extends InitialUserProps {
  initialBoards: IBoardPaging | null;
}

const BoardIndexPage: NextPage<IndexProps> = ({ initialBoards }) => {
  const userContext = useUserContext();
  const { data } = useBoards(initialBoards);

  return (
    <Layout title="Home | Next.js + TypeScript Example" {...userContext}>
      <CLink href={'/board/create'}>Create Board</CLink>
      {data?.content?.map((board) => {
        return (
          <li key={board.id}>
            <Link
              href={{
                pathname: '/board/[id]',
                query: { id: board.id }
              }}>
              <a>
                <span>{`${board.title}: ${board.id}`}</span>
              </a>
            </Link>
          </li>
        );
      })}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const getBoards = await fetch(BOARD_URI.BASE);
  const initialBoards = getBoards.ok ? await getBoards.json() : null;
  return {
    props: {
      initialBoards
    }
  };
};

export default BoardIndexPage;
