import { css } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserCircle } from 'react-icons/fa';
import * as yup from 'yup';

import { IComment, ICommentCreateRequest } from '../../../shared/apis/comment';
import { BOARD_ERROR_MESSAGES } from '../../../shared/enums';
import { Body, Button, FlexBox, Form, SubH2, TextInput } from '../../atoms';
import { FormItem } from '../../molecules/FormItem';

const schema = yup.object().shape({
  text: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_TITLE)
});

interface Props {
  comment: IComment;
  onClickEdit?: any;
  onClickDelete?: any;
}

export const BaseComment: React.FC<Props> = ({ comment, onClickEdit, onClickDelete }) => {
  const [editMode, setEditMode] = useState(false);

  const { handleSubmit, register, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    async (id: number, form: ICommentCreateRequest) => {
      if (onClickEdit) {
        onClickEdit(id, form, () => setEditMode(false));
        return;
      } else {
        return;
      }
    },
    [comment]
  );

  const handleOnClickButton = useCallback(
    (id: string | number) => () => {
      if (onClickDelete) {
        onClickDelete(id);
        return;
      } else {
        return;
      }
    },
    [comment]
  );

  return (
    <FlexBox
      gap={16}
      key={comment.commentId}
      css={css`
        background-color: #ffffff;
        border-radius: 8px;
        padding: 16px;
      `}>
      <FlexBox horizontal={'flex-start'}>
        <FaUserCircle size={'4rem'} />
      </FlexBox>
      <FlexBox
        direction={'column'}
        gap={8}
        css={css`
          flex: 1;
        `}>
        <FlexBox vertical={'space-between'}>
          <SubH2 el={'h2'}>{comment.username}</SubH2>
          {!editMode && (
            <FlexBox gap={8}>
              <Button text={'Edit'} onClick={() => setEditMode(true)} />
              <Button
                text={'Delete'}
                colors={{ bg: 'red', text: 'white' }}
                onClick={handleOnClickButton(comment.commentId)}
              />
            </FlexBox>
          )}
        </FlexBox>
        {editMode ? (
          <Form onSubmit={handleSubmit((s) => onSubmit(comment.commentId, s))}>
            <FormItem label={''} errors={errors.text?.message}>
              <TextInput name={'text'} register={register} defaultValue={comment.text} />
              <Button type={'submit'} text={'Edit'} />
            </FormItem>
          </Form>
        ) : (
          <Body el={'p'}>{comment.text}</Body>
        )}
      </FlexBox>
    </FlexBox>
  );
};
