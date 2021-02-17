import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { RiMoreLine } from 'react-icons/ri';
import useSWR from 'swr';

import { H1, IconButton, Span } from '../../../components/atoms';
import { FlexBox } from '../../../components/atoms/FlexBox';
import { HForm } from '../../../components/atoms/HForm';
import { HInput } from '../../../components/atoms/HInput';
import { Body } from '../../../components/atoms/Typography';
import { BaseComment } from '../../../components/molecules/BaseComment';
import { Dropdown } from '../../../components/molecules/Dropdown';
import { FormItem } from '../../../components/molecules/FormItem';
import { Layout } from '../../../components/templates/Layout';
import {
  createCommentAction,
  deleteBoardAction,
  deleteCommentAction,
  editCommentAction
} from '../../../shared/actions';
import { BOARD_URL } from '../../../shared/enums';
import { withSession } from '../../../shared/hocs';
import { useUser } from '../../../shared/hooks';
import { commentSchema } from '../../../shared/schemas';
import { BoardProps, CommentForm, CommentProps, UserProps } from '../../../shared/types';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {
  initialUser?: UserProps;
  initialBoard?: BoardProps;
  initialComments: CommentProps[];
}

const BoardPage: NextPage<Props> = ({ initialUser, initialBoard, initialComments }) => {
  const router = useRouter();
  const { user } = useUser({
    initialUser
  });
  const { data: board } = useSWR(`${BOARD_URL.BASE_BOARD}/${router.query.id}`, {
    initialData: initialBoard
  });

  const { data: comments, mutate: mutateComments } = useSWR(`${BOARD_URL.BASE_BOARD}/${router.query.id}/comment`, {
    initialData: initialComments
  });

  const handleSubmitComment = async (form: CommentForm) => {
    const currentCache = comments || [];
    mutateComments([{ text: form.text } as CommentProps, ...currentCache], false);
    const res = await createCommentAction(Number(router.query.id), form);
    mutateComments([res.data, ...currentCache], false);
  };

  const onClickDeleteBoard = async () => {
    await deleteBoardAction(Number(router.query.id));
    router.push('/board');
  };

  const onClickDeleteComment = async (commentId: number) => {
    await deleteCommentAction(Number(router.query.id), commentId);
    mutateComments(
      comments?.filter((co) => co.commentId != commentId),
      false
    );
  };

  const onClickEditComment = async (commentId: number, form: CommentForm) => {
    const currentCache = comments || [];
    const updatedCache = currentCache.map((co) => (co.commentId === commentId ? { ...co, text: form.text } : co));
    mutateComments([...updatedCache], false);
    const res = await editCommentAction(Number(router.query.id), commentId, form);
    const realData = updatedCache.map((co) => (co.commentId === commentId ? { ...res.data } : co));
    mutateComments([...realData], false);
  };

  if (!board) return null;

  const isAuthor: boolean = board.userId == user.userId;

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
      <FlexBox direction={'column'} gap={24}>
        <FlexBox
          direction={'column'}
          gap={12}
          css={css`
            //background-image: url(https://blog.kakaocdn.net/dn/bOtlfr/btqDQcJISWv/nMc6SFQmTWQMmtEQGhdhsK/img.jpg);
            //background-color: #090909;
            //color: white;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
            height: 20rem;
          `}>
          <Body
            css={css`
              text-align: center;
            `}>
            {board.categoryName}
          </Body>
          <H1
            css={css`
              font-size: 3rem;
              text-align: center;
            `}>
            {board.title}
          </H1>
        </FlexBox>
        <FlexBox
          vertical={'space-between'}
          css={css`
            padding: 16px;
            border-bottom: 1px solid #eaeaea;
          `}>
          <FlexBox gap={8}>
            <Span
              css={css`
                color: rgb(90, 90, 90);
              `}>
              {board.username}
            </Span>
            <Span
              css={css`
                color: rgb(152, 152, 152);
              `}>
              {board.createdAt}
            </Span>
          </FlexBox>
          {isAuthor && (
            <FlexBox>
              <Dropdown
                menuPosition={'left'}
                button={<RiMoreLine size={'2rem'} />}
                menus={[
                  { text: 'Edit', url: `/board/${board.boardId}/edit` },
                  { text: 'Delete', onClick: onClickDeleteBoard }
                ]}
              />
            </FlexBox>
          )}
        </FlexBox>
        <div
          css={css`
            .ql-container.ql-snow {
              border: none;
            }
          `}>
          <QuillNoSSRWrapper theme="snow" readOnly modules={{ toolbar: false }} value={board.description} />
        </div>
        <FlexBox vertical={'space-between'}>
          <FlexBox gap={8}>
            <IconButton icon={'AiOutlineHeart'} iconColor={'#ff5353'} content={'공감 46'} />
            <IconButton icon={'AiOutlineComment'} iconColor={'#838383'} content={`댓글 ${comments?.length}`} />
          </FlexBox>
        </FlexBox>
        <div>
          <HForm onSubmit={handleSubmitComment} resolver={yupResolver(commentSchema)} mode={'onSubmit'}>
            {({ register, errors }) => (
              <FlexBox>
                <FormItem
                  errors={errors?.text?.message}
                  css={css`
                    flex: 1;
                  `}>
                  <HInput ref={register} name={'text'} />
                </FormItem>
                <HInput
                  type={'submit'}
                  css={css`
                    display: none;
                  `}
                />
              </FlexBox>
            )}
          </HForm>
          <FlexBox direction={'column'}>
            {comments ? (
              comments.map((comment, idx) => (
                <BaseComment
                  key={idx}
                  comment={comment}
                  currentUserId={user?.userId}
                  handleEdit={onClickEditComment}
                  handleDelete={onClickDeleteComment}
                />
              ))
            ) : (
              <p>Refetching...</p>
            )}
          </FlexBox>
        </div>
      </FlexBox>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
  const initialUser = ctx.req.session.get('initialUser') || null;
  let initialBoards = null;
  let initialComments = null;

  await Promise.allSettled([
    axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.query.id}`),
    axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.query.id}/comment`)
  ]).then(
    axios.spread((...response) => {
      initialBoards = response[0].status === 'fulfilled' ? response[0].value.data : null;
      initialComments = response[1].status === 'fulfilled' ? response[1].value.data : null;
    })
  );

  return {
    props: {
      initialUser,
      initialBoards,
      initialComments
    }
  };
});

export default BoardPage;
