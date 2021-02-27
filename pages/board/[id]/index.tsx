import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
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
import { useAlertContext, useAuth } from '../../../shared/hooks';
import { useSwr } from '../../../shared/hooks/useSwr';
import { commentSchema } from '../../../shared/schemas';
import { BoardIdsResponse, CommentForm, IBoard, IComment } from '../../../shared/types';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(BOARD_URL.BASE_BOARD_IDS);
  const boardIds: BoardIdsResponse[] = await res.json();

  const paths = boardIds.map((data) => ({
    params: { id: data.boardId.toString() }
  }));

  return { paths, fallback: true };
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const [a] = await Promise.allSettled([axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.params?.id}`)]);

  const initialBoard: IBoard | undefined = a.status === 'fulfilled' ? a.value.data : undefined;

  return {
    revalidate: 1,
    props: {
      initialBoard
    }
  };
};

const BoardPage = ({ initialBoard }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { setAlert } = useAlertContext();
  const { user } = useAuth();
  const { data: board } = useSwr(`${BOARD_URL.BASE_BOARD}/${router.query.id}`, {
    initialData: initialBoard
  });

  const { data: comments, mutate: mutateComments } = useSWR<IComment[]>(
    `${BOARD_URL.BASE_BOARD}/${router.query.id}/comment`
  );

  const deleteBoard = async () => {
    try {
      await deleteBoardAction(Number(router.query.id));
      router.push('/board');
    } catch (error) {
      setAlert({
        type: 'error',
        message: '게시물 삭제 에러입니다.'
      });
    }
  };

  const createComment = async (form: CommentForm) => {
    const commentId = new Date().getTime();
    const originalCache = comments || [];
    mutateComments([{ commentId, text: form.text } as IComment, ...originalCache], false);
    try {
      const res = await createCommentAction(Number(router.query.id), form);
      mutateComments([res.data, ...originalCache], false);
    } catch (error) {
      setAlert({
        type: 'error',
        message: '댓글 작성 에러입니다.'
      });
      mutateComments(originalCache, false);
    }
  };

  const editComment = async (commentId: number, form: CommentForm) => {
    const originalCache = comments || [];
    const updatedCache = originalCache.map((co) => (co.commentId === commentId ? { ...co, text: form.text } : co));
    mutateComments([...updatedCache], false);
    try {
      const res = await editCommentAction(Number(router.query.id), commentId, form);
      const realData = updatedCache.map((co) => (co.commentId === commentId ? { ...res.data } : co));
      mutateComments([...realData], false);
      return false;
    } catch (error) {
      setAlert({
        type: 'error',
        message: '댓글 수정 에러입니다.'
      });
      mutateComments(originalCache, false);
      return true;
    }
  };

  const deleteComment = async (commentId: number) => {
    const originalCache = comments || [];
    const filteredCache = originalCache.filter((co) => co.commentId != commentId);
    mutateComments(filteredCache, false);
    try {
      await deleteCommentAction(Number(router.query.id), commentId);
    } catch (error) {
      setAlert({
        type: 'error',
        message: '댓글 삭제 에러입니다.'
      });
      mutateComments(originalCache, false);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const isAuthor: boolean = board?.userId == user?.userId;

  console.log(comments);

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
            {board?.categoryName}
          </Body>
          <H1
            css={css`
              font-size: 3rem;
              text-align: center;
            `}>
            {board?.title}
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
              {board?.username}
            </Span>
            <Span
              css={css`
                color: rgb(152, 152, 152);
              `}>
              {board?.createdAt}
            </Span>
          </FlexBox>
          {isAuthor && (
            <FlexBox>
              <Dropdown
                menuPosition={'left'}
                button={<RiMoreLine size={'2rem'} />}
                menus={[
                  { text: 'Edit', url: `/board/${board?.boardId}/edit` },
                  { text: 'Delete', onClick: deleteBoard }
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
          <QuillNoSSRWrapper theme="snow" readOnly modules={{ toolbar: false }} value={board?.description} />
        </div>
        <FlexBox vertical={'space-between'}>
          <FlexBox gap={8}>
            <IconButton icon={'AiOutlineHeart'} iconColor={'#ff5353'} content={'공감 46'} />
            <IconButton icon={'AiOutlineComment'} iconColor={'#838383'} content={`댓글 ${comments?.length}`} />
          </FlexBox>
        </FlexBox>
        <div>
          {user.isLoggedIn && (
            <HForm onSubmit={createComment} resolver={yupResolver(commentSchema)} mode={'onSubmit'}>
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
          )}
          <FlexBox direction={'column'}>
            {comments?.map((comment, idx) => (
              <FlexBox
                key={idx}
                direction={'column'}
                css={css`
                  border: 1px solid red;
                `}>
                <BaseComment
                  comment={comment}
                  currentUserId={user?.userId}
                  handleEdit={editComment}
                  handleDelete={deleteComment}
                />
                <FlexBox
                  direction={'column'}
                  css={css`
                    margin-left: 32px;
                  `}>
                  <p>답글 쓰기</p>
                  {user.isLoggedIn && (
                    <HForm onSubmit={createComment} resolver={yupResolver(commentSchema)} mode={'onSubmit'}>
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
                  )}
                </FlexBox>
              </FlexBox>
            ))}
          </FlexBox>
        </div>
      </FlexBox>
    </Layout>
  );
};

// export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
//   const initialUser = ctx.req.session.get('initialUser') || null;
//   let initialBoards = null;
//   let initialComments = null;
//
//   await Promise.allSettled([
//     axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.query.id}`),
//     axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.query.id}/comment`)
//   ]).then(
//     axios.spread((...response) => {
//       initialBoards = response[0].status === 'fulfilled' ? response[0].value.data : null;
//       initialComments = response[1].status === 'fulfilled' ? response[1].value.data : null;
//     })
//   );
//
//   return {
//     props: {
//       initialUser,
//       initialBoards,
//       initialComments
//     }
//   };
// });

export default BoardPage;
