import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import { Button, HForm, HInput, HSelect } from '../../../components/atoms';
import { Layout } from '../../../components/common';
import { FormItem } from '../../../components/molecules';
import { basePatchAPI, ErrorProps, IBoard, IBoardUpdateRequest, UserProps } from '../../../shared/apis';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../../shared/enums';
import { useBoard, useCategory } from '../../../shared/hooks';
import useUser from '../../../shared/hooks/useUser';
import withSession from '../../../shared/session';
import { getAsString } from '../../../shared/utils/getAsString';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props extends ErrorProps {
  boardId: string;
  initialUser?: UserProps;
  initialBoard: IBoard | null;
}

const schema = yup.object().shape({
  title: yup.string().typeError(BOARD_ERROR_MESSAGES.STRING_TYPE).max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE),
  description: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(2000, BOARD_ERROR_MESSAGES.MAX_LENGTH_DESCRIPTION)
    .test('validate-description', BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION, (value) => value !== '<p><br></p>')
    .required(BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION),
  categoryId: yup.number().typeError(BOARD_ERROR_MESSAGES.NUMBER_TYPE)
});

const UpdateBoardPage: NextPage<Props> = ({ boardId, initialUser, initialBoard, errorCode, errorMessage }) => {
  const { user } = useUser({
    initialUser
  });
  const router = useRouter();

  const { data, mutate } = useBoard(boardId, initialBoard);

  const { data: categories } = useCategory();

  const onSubmit = useCallback(
    async (form: IBoardUpdateRequest) => {
      await basePatchAPI(`${BOARD_URI.BASE}/${boardId}`, form);
      await mutate();
      await router.push(`/board/${boardId}`);
    },
    [mutate, boardId]
  );

  console.log(`errorCode: ${errorCode}`);
  console.log(`errorMessage: ${errorMessage}`);

  return (
    <Layout title="edit board page" isLoggedIn={user.isLoggedIn}>
      <HForm<IBoardUpdateRequest> onSubmit={onSubmit} resolver={yupResolver(schema)}>
        {({ register, errors, control }) => (
          <>
            <FormItem label={'Category'} errors={errors.categoryId?.message}>
              <HSelect
                defaultValue={data?.categoryId}
                name="categoryId"
                ref={register}
                options={categories?.map((c) => ({ id: c.categoryId, value: c.categoryId, label: c.name }))}
              />
            </FormItem>
            <FormItem label={'Title'} errors={errors.title?.message}>
              <HInput name={'title'} ref={register} defaultValue={data?.title} />
            </FormItem>
            <FormItem label={'Description'} errors={errors.description?.message}>
              <Controller
                control={control}
                name="description"
                defaultValue={data?.description}
                render={({ onChange, value }) => (
                  <QuillNoSSRWrapper theme="snow" value={value} onChange={onChange} defaultValue={data?.description} />
                )}
              />
            </FormItem>
            <Button type="submit" text="edit" />
          </>
        )}
      </HForm>
    </Layout>
  );
};

export const getServerSideProps = withSession(async (ctx) => {
  try {
    const initialUser = ctx.req.session.get('initialUser');

    if (initialUser === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: '/login'
        }
      };
    }
    const boardId = getAsString(ctx.query.id || '');
    const boardResponse = await axios.get(`${BOARD_URI.BASE}/${boardId}`);

    return {
      props: {
        initialUser,
        boardId,
        initialBoard: boardResponse.data
      }
    };
  } catch (e) {
    const err = e as AxiosError;
    return {
      props: {
        errorCode: err.response?.status,
        errorMessage: err.response?.data.message
      }
    };
  }
});

export default UpdateBoardPage;
