import 'react-quill/dist/quill.snow.css';

import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { RiMoreLine } from 'react-icons/ri';
import useSWR from 'swr';

import { Body, FlexBox, H1, HForm, HInput, IconButton, Span } from '../../../components/atoms';
import { BaseComment, Dropdown, FormItem } from '../../../components/molecules';
import { Layout } from '../../../components/templates';
import { CommentCreateRequest, CommentFlatDto } from '../../../generated-sources/openapi';
import { boardApi, commentApi, commentSchema, useAlertContext, useAuth, useSwr } from '../../../shared';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await boardApi.getBoardIds();

  const paths = res.data.map((data) => ({
    params: { id: data.boardId.toString() }
  }));

  return { paths, fallback: true };
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
  const res = await boardApi.getBoard(Number(ctx.params?.id));
  return {
    revalidate: 1,
    props: {
      initialBoard: res.data
    }
  };
};

const BoardPage = ({ initialBoard }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { setAlert } = useAlertContext();
  const { userId, isLoggedIn } = useAuth();
  const { data: board } = useSwr(`http://localhost:8080/api/v1/${router.query.id}`, {
    initialData: initialBoard
  });

  const { data: comments, mutate: mutateComments } = useSWR<CommentFlatDto[]>(
    `http://localhost:8080/api/v1/board/${router.query.id}/comment`
  );

  const deleteBoard = async () => {
    try {
      await boardApi.deleteBoard(Number(router.query.id));
      router.push('/board');
    } catch (error) {
      setAlert({
        type: 'error',
        message: '게시물 삭제 에러입니다.'
      });
    }
  };

  const createComment = async (form: CommentCreateRequest) => {
    const commentId = new Date().getTime();
    const originalCache = comments || [];
    mutateComments([{ commentId, text: form.text } as CommentFlatDto, ...originalCache], false);
    try {
      await commentApi.createComment(Number(router.query.id), form);
      mutateComments();
    } catch (error) {
      setAlert({
        type: 'error',
        message: '댓글 작성 에러입니다.'
      });
      mutateComments(originalCache, false);
    }
  };

  const createSubComment = (supCommentId: number) => async (form: CommentCreateRequest) => {
    const commentId = new Date().getTime();
    const originalCache = comments || [];
    mutateComments([{ commentId, text: form.text } as CommentFlatDto, ...originalCache], false);
    try {
      await commentApi.createComment(Number(router.query.id), {
        ...form,
        commentId: supCommentId
      });
      mutateComments();
    } catch (error) {
      setAlert({
        type: 'error',
        message: '댓글 작성 에러입니다.'
      });
      mutateComments(originalCache, false);
    }
  };

  const editComment = async (commentId: number, form: CommentCreateRequest) => {
    const originalCache = comments || [];
    const updatedCache = originalCache.map((co) => (co.commentId === commentId ? { ...co, text: form.text } : co));
    mutateComments([...updatedCache], false);
    try {
      await commentApi.updateComment(Number(router.query.id), commentId, form);
      mutateComments();
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
      await commentApi.deleteComment(Number(router.query.id), commentId);
      mutateComments();
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

  const isAuthor: boolean = board?.userId == userId;

  console.log(comments);

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <FlexBox direction={'column'} gap={24}>
        <FlexBox
          direction={'column'}
          gap={12}
          css={css`
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
          {isLoggedIn && (
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
                  currentUserId={userId}
                  handleEdit={editComment}
                  handleDelete={deleteComment}
                />
                <FlexBox
                  direction={'column'}
                  css={css`
                    margin-left: 32px;
                  `}>
                  {comment.subComment?.map((c) => {
                    return (
                      <BaseComment
                        key={c.commentId}
                        comment={c}
                        currentUserId={userId}
                        handleEdit={editComment}
                        handleDelete={deleteComment}
                      />
                    );
                  })}
                  <p>답글 쓰기</p>
                  {isLoggedIn && (
                    <HForm
                      onSubmit={createSubComment(comment.commentId)}
                      resolver={yupResolver(commentSchema)}
                      mode={'onSubmit'}>
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

export default BoardPage;
