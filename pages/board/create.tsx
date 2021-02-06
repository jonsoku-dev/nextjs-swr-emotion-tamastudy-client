import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, Select, TextInput } from '../../components/atoms';
import { Layout } from '../../components/common';
import { FormItem } from '../../components/molecules';
import { basePostAPI, IBoard, IBoardCreateRequest, ICategory } from '../../shared/apis';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../shared/enums';
import { useBoards, useCategory, useUserContext } from '../../shared/hooks';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {}

const schema = yup.object().shape({
  title: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_TITLE),
  description: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(2000, BOARD_ERROR_MESSAGES.MAX_LENGTH_DESCRIPTION)
    .test('validate-description', BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION, (value) => value !== '<p><br></p>')
    .required(BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION),
  categoryId: yup
    .number()
    .typeError(BOARD_ERROR_MESSAGES.NUMBER_TYPE)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_CATEGORY_ID)
});

const CreateBoardPage: NextPage<Props> = () => {
  const userContext = useUserContext();
  const router = useRouter();

  const { mutate } = useBoards();
  const { data: categories } = useCategory();

  const { handleSubmit, register, errors, control } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    async (form: IBoardCreateRequest) => {
      await basePostAPI<IBoardCreateRequest, IBoard>(BOARD_URI.BASE, form);
      await mutate();
      await router.push('/board');
    },
    [mutate]
  );

  return (
    <Layout title="create board page" {...userContext}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormItem label={'Category'} errors={errors.categoryId?.message}>
          <Select<ICategory> name="categoryId" options={categories} value={'id'} text={'name'} register={register} />
        </FormItem>
        <FormItem label={'Title'} errors={errors.title?.message}>
          <TextInput name={'title'} register={register} />
        </FormItem>
        <FormItem label={'Description'} errors={errors.description?.message}>
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ onChange, value }) => (
              <QuillNoSSRWrapper theme="snow" value={value} onChange={onChange} defaultValue="" />
            )}
          />
        </FormItem>
        <Button type="submit" text="create" />
      </Form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default CreateBoardPage;
