import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller } from 'react-hook-form';

import { HForm, HInput, HSelect } from '../../components/atoms';
import { FormItem } from '../../components/molecules';
import { Layout } from '../../components/templates';
import { BoardCreateRequest } from '../../generated-sources/openapi';
import { boardApi, categoryApi, createBoardSchema, useAlertContext, useAuth } from '../../shared';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

export const getStaticProps = async () => {
  const res = await categoryApi.getCategories();

  return {
    props: {
      initialCategories: res.data
    }
  };
};

const CreateBoardPage = ({ initialCategories }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { setAlert } = useAlertContext();
  const { isLoggedIn } = useAuth();

  const handleSubmit = async (form: BoardCreateRequest) => {
    try {
      const res = await boardApi.createBoard(form);
      router.push(`/board/${res.data.boardId}`);
    } catch (error) {
      setAlert({
        message: '게시물 생성 에러입니다.',
        type: 'error'
      });
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn} redirectIfFound={false} redirectTo={'/board'}>
      <HForm onSubmit={handleSubmit} resolver={yupResolver(createBoardSchema)}>
        {({ register, control, errors }) => (
          <>
            <FormItem label={'Category'} errors={errors?.categoryId?.message}>
              <HSelect
                ref={register}
                name={'categoryId'}
                options={initialCategories?.map((ca) => ({ id: ca.categoryId, label: ca.name, value: ca.categoryId }))}
              />
            </FormItem>
            <FormItem label={'Title'} errors={errors?.title?.message}>
              <HInput ref={register} name={'title'} />
            </FormItem>
            <FormItem label={'Description'} errors={errors?.description?.message}>
              <Controller
                control={control}
                name="description"
                defaultValue=""
                render={({ onChange, value }) => (
                  <QuillNoSSRWrapper theme="snow" value={value} onChange={onChange} defaultValue="" />
                )}
              />
            </FormItem>
            <HInput type="submit" />
          </>
        )}
      </HForm>
    </Layout>
  );
};

export default CreateBoardPage;
