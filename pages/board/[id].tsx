import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import Layout from '../../components/Layout';
import { deleteBoard, updateBoard } from '../../shared/apis';
import useBoard from '../../shared/hooks/useBoard';

const BoardPage = () => {
  const router = useRouter();

  const boardId = router.query['id'] as string;

  const { board, isLoading, setBoard } = useBoard(boardId);

  const handleUpdateBoard = useCallback(async () => {
    await updateBoard(boardId);
    await setBoard();
  }, [boardId]);

  const handleDeleteBoard = useCallback(async () => {
    await deleteBoard(boardId);
    await setBoard(null);
    await router.push('/');
  }, [boardId]);

  useEffect(() => {
    if (!isLoading && !board) {
      router.push('/');
    }
  }, [isLoading, board, boardId]);

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <h1>About</h1>
      <p>This is the about page</p>
      <button onClick={handleUpdateBoard}>{`${boardId}번 게시물 `}UPDATE DUMMY POST!!!</button>
      <button onClick={handleDeleteBoard}>{`${boardId}번 게시물 `}DELETE DUMMY POST!!!</button>
      <p>
        <Link href="/board">
          <a>Go to Board</a>
        </Link>
      </p>
    </Layout>
  );
};

export default BoardPage;
