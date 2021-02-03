import { GetServerSideProps } from 'next';
import Link from 'next/link';
import nookies from 'nookies';
import React, { useCallback } from 'react';

import Layout from '../../components/Layout';
import { IBoard, IBoardCreateRequest, IBoardPaging, IBoardUpdateRequest, IUser } from '../../shared/apis';
import { BOARD_URI, JWT_TOKEN, USER_URI } from '../../shared/enums';
import usePagingCrud from '../../shared/hooks/usePagingCrud';
import useUsers from '../../shared/hooks/useUsers';

export interface IndexProps {
  initialBoards: IBoardPaging | null;
  initialUser: IUser | null;
}

const BoardIndexPage = ({ initialBoards, initialUser }: IndexProps) => {
  const {
    fetch: { user, isLoggedIn },
    joinUser,
    loginUser,
    logoutUser
  } = useUsers(initialUser);
  const {
    fetch: { data },
    create,
    remove,
    update
  } = usePagingCrud<IBoard, IBoardCreateRequest, IBoardUpdateRequest>(BOARD_URI.BASE, initialBoards);

  const onClickCreateBoard = useCallback(async () => {
    await create({
      title: 'test',
      description: 'hey',
      categoryId: 1
    });
  }, []);

  const onClickDeleteBoard = useCallback(
    (id: number | string) => async () => {
      await remove(id);
    },
    []
  );

  const onClickUpdateBoard = useCallback(
    (id: number | string) => async () => {
      await update(id, { title: '1234', description: '213213', categoryId: 1 });
    },
    []
  );

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello {user?.username}</h1>
      <button onClick={joinUser}>JOIN!!!</button>
      {isLoggedIn ? (
        <button onClick={logoutUser}>Logout</button>
      ) : (
        <button onClick={loginUser}>Login To Continue</button>
      )}
      <button onClick={onClickCreateBoard}>CREATE DUMMY POST!!!</button>
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
            {isLoggedIn && (
              <>
                <button onClick={onClickDeleteBoard(board.id)}>X</button>
                <button onClick={onClickUpdateBoard(board.id)}>UPDATE!!!</button>
              </>
            )}
          </li>
        );
      })}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (ctx) => {
  const [getBoards, getUser] = await Promise.all([
    fetch(BOARD_URI.BASE),
    fetch(USER_URI.GET_USER, {
      headers: {
        Authorization: `Bearer ${nookies.get(ctx)[JWT_TOKEN]}`
      }
    })
  ]);
  const initialBoards = getBoards.ok ? await getBoards.json() : null;
  const initialUser = getUser.ok ? await getUser.json() : null;
  return {
    props: {
      initialBoards,
      initialUser
    }
  };
};

export default BoardIndexPage;
