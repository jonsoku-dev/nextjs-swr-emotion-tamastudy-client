import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import React, { useState } from 'react';
import { AiFillAmazonCircle } from 'react-icons/ai';

import { CommentCreateRequest, CommentFlatDto } from '../../../generated-sources/openapi';
import { commentSchema } from '../../../shared';
import { Button, FlexBox, HForm, HInput, Span } from '../../atoms';
import { FormItem } from '../FormItem';

interface Props {
  comment: CommentFlatDto;
  currentUserId: number | null;
  handleEdit: (commentId: number, form: CommentCreateRequest) => Promise<boolean>;
  handleDelete: (commentId: number) => Promise<void>;
}

export const BaseComment: NextPage<Props> = ({ comment, currentUserId, handleEdit, handleDelete }) => {
  const [editMode, setEditMode] = useState(false);

  const onClickEditButton = () => setEditMode(true);
  const onClickDeleteButton = () => handleDelete(comment.commentId);
  const handleSubmit = (form: CommentCreateRequest) => handleEdit(comment.commentId, form).then(setEditMode);

  const isAuthor: boolean = comment.userId == currentUserId;

  return (
    <FlexBox
      vertical={'space-between'}
      css={css`
        padding: 32px 0;
        border-bottom: 1px solid #eaeaea;
      `}>
      <FlexBox
        direction={'column'}
        gap={8}
        css={css`
          width: 100%;
        `}>
        <FlexBox vertical={'flex-start'} horizontal={'center'} gap={4}>
          <AiFillAmazonCircle size={'2rem'} />
          <Span
            css={css`
              font-weight: 600;
            `}>
            {comment.username}
          </Span>
        </FlexBox>
        {editMode ? (
          <HForm onSubmit={handleSubmit} resolver={yupResolver(commentSchema)}>
            {({ register, errors }) => {
              return (
                <FlexBox>
                  <FormItem
                    errors={errors?.text?.message}
                    css={css`
                      flex: 1;
                      margin-right: auto;
                    `}>
                    <HInput ref={register} name={'text'} defaultValue={comment.text} />
                  </FormItem>
                  <HInput
                    type={'submit'}
                    css={css`
                      display: none;
                    `}
                  />
                </FlexBox>
              );
            }}
          </HForm>
        ) : (
          <>
            <p>{comment.text}</p>
            <p
              css={css`
                font-size: 1.1rem;
                color: #969696;
              `}>
              {comment.createdAt}
            </p>
          </>
        )}
      </FlexBox>
      <FlexBox direction={'column'} gap={8}>
        {!editMode && isAuthor && (
          <>
            <Button onClick={onClickEditButton} icon={'AiOutlineEdit'}>
              Edit
            </Button>
            <Button onClick={onClickDeleteButton} icon={'AiOutlineDelete'}>
              Delete
            </Button>
          </>
        )}
      </FlexBox>
    </FlexBox>
  );
};
