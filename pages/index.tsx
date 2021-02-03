import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { useCallback } from 'react';

import Layout from '../components/Layout';
import { deleteBoard, IBoardPaging } from '../shared/apis';
import useBoards from '../shared/hooks/useBoards';
import useUsers from '../shared/hooks/useUsers';
import axios from '../shared/utils/axios';

export interface IndexProps {
  initialBoards: IBoardPaging;
}

const IndexPage = ({ initialBoards }: IndexProps) => {
  // console.log(boards);
  const { user, joinUser, loginUser, logoutUser } = useUsers();
  const { boards, setBoards, createBoard } = useBoards({ initialBoards });

  const onClickCreateBoard = useCallback(async () => {
    await createBoard();
  }, []);

  const onClickDeleteBoard = useCallback(
    (id: number | string) => async () => {
      await deleteBoard(id);
      await setBoards();
    },
    []
  );

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js</h1>
      <button onClick={joinUser}>JOIN!!!</button>
      {user ? <button onClick={logoutUser}>Logout</button> : <button onClick={loginUser}>Login To Continue</button>}
      <button onClick={onClickCreateBoard}>CREATE DUMMY POST!!!</button>
      {boards?.content?.map((board) => {
        return (
          <li key={board.id}>
            <Link
              href={{
                pathname: '/board/[id]',
                query: { id: board.id }
              }}>
              <>
                <span>{`${board.title}: ${board.id}`}</span>
                <button onClick={onClickDeleteBoard(board.id)}>X</button>
              </>
            </Link>
          </li>
        );
      })}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const res = await axios.get('/v1/board/v2');
  if (res.status !== 200) {
    return {
      props: {
        initialBoards: {}
      }
    };
  }
  return {
    props: {
      initialBoards: res.data
    }
  };
};

export default IndexPage;
