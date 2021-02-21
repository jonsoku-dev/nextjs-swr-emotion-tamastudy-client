import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller } from 'react-hook-form';
import useSWR from 'swr';

import { HForm, HInput, HSelect } from '../../../components/atoms';
import { FormItem } from '../../../components/molecules';
import { Layout } from '../../../components/templates/Layout';
import {
  BOARD_URL,
  CreateBoardForm,
  createBoardSchema,
  editBoardAction,
  IBoard,
  ICategory,
  useAlertContext,
  useAuth
} from '../../../shared';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {}

const EditBoardPage: NextPage<Props> = () => {
  const { setError } = useAlertContext();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const { data: board, mutate: mutateBoard } = useSWR<IBoard>(`${BOARD_URL.BASE_BOARD}/${router.query.id}`, {});

  const { data: categories } = useSWR<ICategory[]>(`${BOARD_URL.BASE_CATEGORY}`, {});

  const handleSubmit = async (form: CreateBoardForm) => {
    if (board) {
      mutateBoard({ ...board, ...form }, false);
      try {
        const res = await editBoardAction(Number(router.query.id), form);
        mutateBoard({ ...board, ...res.data }, false);
        router.push(`/board/${router.query.id}`);
      } catch (error) {
        setError({
          type: 'error',
          message: '게시물 수정 에러입니다.',
          status: error.response?.status
        });
        mutateBoard({ ...board }, false);
      }
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} redirectIfFound={false} redirectTo={`/board/${router.query.id}`}>
      <HForm onSubmit={handleSubmit} resolver={yupResolver(createBoardSchema)}>
        {({ register, control, errors }) => (
          <>
            <FormItem label={'Category'} errors={errors?.categoryId?.message}>
              <HSelect
                defaultValue={board?.categoryId}
                ref={register}
                name={'categoryId'}
                options={categories?.map((ca) => ({ id: ca.categoryId, label: ca.name, value: ca.categoryId }))}
              />
            </FormItem>
            <FormItem label={'Title'} errors={errors?.title?.message}>
              <HInput ref={register} name={'title'} defaultValue={board?.title} />
            </FormItem>
            <FormItem label={'Description'} errors={errors?.description?.message}>
              <Controller
                control={control}
                name="description"
                defaultValue={board?.description}
                render={({ onChange, value }) => <QuillNoSSRWrapper theme="snow" value={value} onChange={onChange} />}
              />
            </FormItem>
            <HInput type="submit" />
          </>
        )}
      </HForm>
    </Layout>
  );
};

export default EditBoardPage;
