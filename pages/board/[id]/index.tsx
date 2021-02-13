import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import useSWR from 'swr';
import * as yup from 'yup';

import { Button, FlexBox, H1, HForm, HInput } from '../../../components/atoms';
import { Layout } from '../../../components/common';
import { Buttons, FormItem, InfoLabels } from '../../../components/molecules';
import { BaseComments } from '../../../components/organisms/BaseComments';
import { baseDeleteAPI, basePatchAPI, basePostAPI, IBoard, UserProps } from '../../../shared/apis';
import { IComment } from '../../../shared/apis/comment';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../../shared/enums';
import { useBoards } from '../../../shared/hooks';
import useUser from '../../../shared/hooks/useUser';
import withSession from '../../../shared/session';
import { getAsString } from '../../../shared/utils/getAsString';
import { IndexProps } from '../index';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

const schema = yup.object().shape({
  text: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_TITLE)
});

interface FormValues {
  text: string;
}

interface BoardPageProps {
  boardId: string;
  initialUser?: UserProps;
  initialBoard?: IBoard;
  initialComments?: IComment[];
}

const BoardPage: React.FC<BoardPageProps> = ({ boardId, initialUser, initialBoard, initialComments }) => {
  const router = useRouter();
  const { mutate: setBoards } = useBoards();
  const { user } = useUser({
    initialUser
  });

  const { data: board } = useSWR(`${BOARD_URI.BASE}/${boardId}`, {
    dedupingInterval: 1500,
    initialData: initialBoard
  });

  const { data: comments, mutate: setComments } = useSWR(`${BOARD_URI.BASE}/${boardId}/comment`, {
    dedupingInterval: 1500,
    initialData: initialComments
  });

  const onClickDelete = useCallback(async () => {
    try {
      await baseDeleteAPI(`${BOARD_URI.BASE}/${boardId}`);
      await setBoards();
      router.push('/board');
    } catch (e) {
      alert(e);
    }
  }, [board]);

  const onClickCommentCreate = useCallback(
    async (form) => {
      try {
        await basePostAPI(`${BOARD_URI.BASE}/${boardId}/comment`, form);
        await setComments();
      } catch (e) {
        alert(e);
      }
    },
    [comments]
  );

  const onClickCommentEdit = useCallback(
    async (commentId, form, cb) => {
      try {
        await basePatchAPI(`${BOARD_URI.BASE}/${boardId}/comment/${commentId}`, form);
        await setComments();
        cb();
      } catch (e) {
        alert(e);
      }
    },
    [board]
  );

  const onClickCommentDelete = useCallback(
    async (commentId) => {
      try {
        await baseDeleteAPI(`${BOARD_URI.BASE}/${boardId}/comment/${commentId}`);
        await setComments();
      } catch (e) {
        alert(e);
      }
    },
    [board]
  );

  useEffect(() => {
    if (!board) {
      router.push('/board');
    }
  }, [board]);

  const isAuthor = user.userId === board?.userId;

  return (
    <Layout title="About | Next.js + TypeScript Example" isLoggedIn={user.isLoggedIn}>
      <FlexBox direction={'column'} gap={24}>
        <H1>{board?.title}</H1>
        <InfoLabels
          gap={16}
          items={[
            { label: '작성자', value: board?.username as string },
            { label: '작성일', value: board?.createdAt as string },
            { label: '수정일', value: board?.updatedAt as string }
          ]}
        />
        <QuillNoSSRWrapper modules={{ toolbar: false }} value={board?.description} readOnly={true} theme={'snow'} />
        <Buttons
          gap={8}
          items={[
            { text: 'list', onClick: () => router.push(`/board`) },
            { text: 'edit', onClick: () => router.push(`/board/${boardId}/edit`), show: isAuthor },
            { text: 'delete', onClick: () => onClickDelete(), show: isAuthor }
          ]}
        />

        <HForm<FormValues> onSubmit={onClickCommentCreate} resolver={yupResolver(schema)}>
          {({ register, errors }) => (
            <FlexBox vertical={'space-between'}>
              <FormItem
                errors={errors.text?.message}
                css={css`
                  flex: 1;
                `}>
                <HInput name={'text'} ref={register} />
              </FormItem>
              <Button type="submit" text="create" />
            </FlexBox>
          )}
        </HForm>

        <BaseComments
          items={comments?.map((c) => ({ ...c, show: isAuthor }))}
          onClickEdit={onClickCommentEdit}
          onClickDelete={onClickCommentDelete}
        />
      </FlexBox>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = withSession(async (ctx) => {
  const initialUser = ctx.req.session.get('initialUser');

  const boardId = getAsString(ctx.query.id || '');
  const [getBoard, getComments] = await Promise.all([
    fetch(`${BOARD_URI.BASE}/${boardId}`),
    fetch(`${BOARD_URI.BASE}/${boardId}/comment`)
  ]);

  const props = {
    boardId,
    initialBoard: getBoard.ok ? await getBoard.json() : null,
    initialComments: getComments.ok ? await getComments.json() : null
  };

  if (initialUser === undefined) {
    return {
      props
    };
  }

  return {
    props: {
      ...props,
      initialUser
    }
  };
});

export default BoardPage;
