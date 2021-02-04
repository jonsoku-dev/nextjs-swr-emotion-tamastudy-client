import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import React, { useCallback } from 'react';

import Layout from '../../components/Layout';
import { IBoard, IBoardCreateRequest, IBoardPaging, IBoardUpdateRequest } from '../../shared/apis';
import { BOARD_URI } from '../../shared/enums';
import usePagingCrud from '../../shared/hooks/usePagingCrud';
import useUsers from '../../shared/hooks/useUsers';
import { InitialUserProps } from '../_app';

export interface IndexProps extends InitialUserProps {
  initialBoards: IBoardPaging | null;
}

const Button = styled('button')`
  padding: 20px;
  background-color: ${(props) => props.theme.primary};
  border-radius: 3px;
`;

const BoardIndexPage: NextPage<IndexProps> = ({ initialUser, initialBoards }) => {
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
      <h1
        css={css`
          background-color: red;
        `}>
        Hello {user?.username}
      </h1>
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
                <Button onClick={onClickDeleteBoard(board.id)}>X</Button>
                <Button onClick={onClickUpdateBoard(board.id)}>UPDATE!!!</Button>
              </>
            )}
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
