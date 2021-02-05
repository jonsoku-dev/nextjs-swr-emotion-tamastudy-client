import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

import { Button, CLink } from '../../../components/atoms';
import { Layout } from '../../../components/common';
import { baseDeleteAPI, IBoard } from '../../../shared/apis';
import { BOARD_URI } from '../../../shared/enums';
import { useBoards, useUserContext } from '../../../shared/hooks';
import { getAsString } from '../../../shared/utils/getAsString';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface BoardPageProps {
  boardId: string;
  initialBoard: IBoard | null;
}

const BoardPage: React.FC<BoardPageProps> = ({ boardId, initialBoard }) => {
  const router = useRouter();
  const { mutate } = useBoards();
  const userContext = useUserContext();

  const { data } = useSWR(`${BOARD_URI.BASE}/${boardId}`, {
    dedupingInterval: 1500,
    initialData: initialBoard
  });

  return (
    <Layout title="About | Next.js + TypeScript Example" {...userContext}>
      <h1>About</h1>
      <p>This is the {boardId} page</p>
      <div>
        <div
          css={css`
            .ql-container.ql-snow {
              border: none;
            }
            .ql-editor {
              padding: 0;
            }
          `}>
          <p>{data?.title}</p>
          <QuillNoSSRWrapper modules={{ toolbar: false }} value={data?.description} readOnly={true} theme={'snow'} />
        </div>
        <Button
          onClick={() =>
            baseDeleteAPI(`${BOARD_URI.BASE}/${data?.id}`, () => {
              mutate();
              router.push('/board');
            })
          }
          text={'Delete'}
        />
        <CLink href={`/board/${data?.id}/edit`}>edit</CLink>
        <CLink href="/board">Go to Board</CLink>
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
