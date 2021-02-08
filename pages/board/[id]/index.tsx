import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import * as yup from 'yup';

import { Button, FlexBox, Form, H1, TextInput } from '../../../components/atoms';
import { Layout } from '../../../components/common';
import { FormItem } from '../../../components/molecules/FormItem';
import { InfoLabel } from '../../../components/molecules/InfoLabel';
import { BaseComment } from '../../../components/organisms/BaseComment';
import { baseDeleteAPI, basePatchAPI, basePostAPI, IBoard, IBoardCreateRequest } from '../../../shared/apis';
import { ICommentCreateRequest } from '../../../shared/apis/comment';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../../shared/enums';
import { useBoards, useUserContext } from '../../../shared/hooks';
import theme from '../../../shared/styles/theme';
import { getAsString } from '../../../shared/utils/getAsString';

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

interface BoardPageProps {
  boardId: string;
  initialBoard: IBoard | null;
}

const BoardPage: React.FC<BoardPageProps> = ({ boardId, initialBoard }) => {
  const router = useRouter();
  const { mutate } = useBoards();
  const userContext = useUserContext();

  const { data, mutate: setBoard } = useSWR(`${BOARD_URI.BASE}/${boardId}`, {
    dedupingInterval: 1500,
    initialData: initialBoard
  });

  const onClickEdit = async (id: number, form: IBoardCreateRequest, cb: any) => {
    await basePatchAPI(`${BOARD_URI.BASE}/${boardId}/comment/${id}`, form);
    await setBoard();
    cb();
  };

  const onClickDelete = async (id: string | number) => {
    await baseDeleteAPI(`${BOARD_URI.BASE}/${boardId}/comment/${id}`);
    await setBoard();
  };

  const { handleSubmit, register, errors, reset } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    async (form: ICommentCreateRequest) => {
      await basePostAPI(`${BOARD_URI.BASE}/${boardId}/comment`, form);
      await setBoard();
      await reset();
    },
    [data]
  );

  useEffect(() => {
    if (!data) {
      router.push('/board');
    }
  }, [data]);

  return (
    <Layout title="About | Next.js + TypeScript Example" {...userContext}>
      <div>
        <FlexBox
          direction={'column'}
          gap={theme.space * 2}
          css={css`
            .ql-container.ql-snow {
              border: none;
            }
            .ql-editor {
              padding: 0;
            }
          `}>
          <H1>{data?.title}</H1>
          <FlexBox direction={'column'} vertical={'flex-start'} gap={theme.space}>
            <InfoLabel label={'작성자'} value={data?.username as string} />
            <InfoLabel label={'작성일'} value={data?.createdAt as string} />
            <InfoLabel label={'수정일'} value={data?.updatedAt as string} />
          </FlexBox>
          <QuillNoSSRWrapper modules={{ toolbar: false }} value={data?.description} readOnly={true} theme={'snow'} />
        </FlexBox>
        <Button
          onClick={async () => {
            await baseDeleteAPI(`${BOARD_URI.BASE}/${data?.boardId}`);
            await mutate();
            await router.push(`/board`);
          }}
          text={'Delete'}
        />
        <Button onClick={() => router.push(`/board/${data?.boardId}/edit`)} text={'Edit'} />
        <Button onClick={() => router.push(`/board`)} text={'List'} />
      </div>
      <div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormItem label={''} errors={errors.text?.message}>
            <TextInput name={'text'} register={register} defaultValue={''} />
            <Button type={'submit'} text={'Create'} />
          </FormItem>
        </Form>
      </div>
      <FlexBox direction={'column'} gap={12}>
        {data?.comments.map((comment) => (
          <BaseComment
            key={comment.commentId}
            comment={comment}
            onClickEdit={onClickEdit}
            onClickDelete={onClickDelete}
          />
        ))}
      </FlexBox>
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
