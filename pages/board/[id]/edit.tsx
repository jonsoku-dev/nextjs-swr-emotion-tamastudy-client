import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, Select, TextInput } from '../../../components/atoms';
import { Layout } from '../../../components/common';
import { FormItem } from '../../../components/molecules';
import { basePatchAPI, IBoard, IBoardUpdateRequest, ICategory } from '../../../shared/apis';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../../shared/enums';
import { useBoard, useCategory, useUserContext } from '../../../shared/hooks';
import { getAsString } from '../../../shared/utils/getAsString';

interface Props {
  boardId: string;
  initialBoard: IBoard | null;
}

const schema = yup.object().shape({
  title: yup.string().typeError(BOARD_ERROR_MESSAGES.STRING_TYPE).max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE),
  description: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(2000, BOARD_ERROR_MESSAGES.MAX_LENGTH_DESCRIPTION),
  categoryId: yup.number().typeError(BOARD_ERROR_MESSAGES.NUMBER_TYPE)
});

const UpdateBoardPage: NextPage<Props> = ({ boardId, initialBoard }) => {
  const userContext = useUserContext();
  const router = useRouter();

  const { data, mutate } = useBoard(boardId, initialBoard);

  const { data: categories } = useCategory();

  const { handleSubmit, register, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    (form: IBoardUpdateRequest) => {
      basePatchAPI(
        `${BOARD_URI.BASE}/${boardId}`,
        form,
        () => {
          mutate();
          router.push(`/board/${boardId}`);
        },
        () => alert('보드 생성 에러')
      );
    },
    [mutate, boardId]
  );

  return (
    <Layout title="edit board page" {...userContext}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormItem label={'Category'} errors={errors.categoryId?.message}>
          <Select<ICategory>
            name="categoryId"
            defaultValue={data?.category?.id}
            options={categories}
            value={'id'}
            text={'name'}
            register={register}
          />
        </FormItem>
        <FormItem label={'Title'} errors={errors.title?.message}>
          <TextInput name={'title'} register={register} defaultValue={data?.title} />
        </FormItem>
        <FormItem label={'Description'} errors={errors.description?.message}>
          <TextInput name={'description'} register={register} defaultValue={data?.description} />
        </FormItem>
        <Button type="submit" text="edit" />
      </Form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const boardId = getAsString(ctx.query.id || '');
  const getBoard = await fetch(`${BOARD_URI.BASE}/${boardId}`);
  const initialBoard = getBoard.ok ? await getBoard.json() : null;
  return {
    props: {
      boardId,
      initialBoard
    }
  };
};

export default UpdateBoardPage;
