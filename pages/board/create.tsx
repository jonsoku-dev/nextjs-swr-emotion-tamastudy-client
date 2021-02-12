import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { Controller } from 'react-hook-form';
import * as yup from 'yup';

import { Button, HForm, HInput, HSelect } from '../../components/atoms';
import { Layout } from '../../components/common';
import { FormItem } from '../../components/molecules';
import { basePostAPI, IBoard, IBoardCreateRequest } from '../../shared/apis';
import { BOARD_ERROR_MESSAGES, BOARD_URI } from '../../shared/enums';
import { useBoards, useCategory, useUserContext } from '../../shared/hooks';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {}

type FormValues = {
  title: string;
  description: string;
  categoryId: number;
};

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
    .test('validate-description', BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION, (value) => {
      return value !== '<p><br></p>';
    })
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

  const onSubmit = useCallback(
    async (form: IBoardCreateRequest) => {
      console.log(form);
      await basePostAPI<IBoardCreateRequest, IBoard>(BOARD_URI.BASE, form);
      await mutate();
      await router.push('/board');
    },
    [mutate]
  );

  return (
    <Layout title="create board page" {...userContext}>
      <HForm<FormValues> onSubmit={onSubmit} resolver={yupResolver(schema)}>
        {({ register, errors, control }) => (
          <>
            <FormItem label={'Category'} errors={errors.categoryId?.message}>
              <HSelect
                name="categoryId"
                ref={register}
                options={categories?.map((c) => ({ id: c.categoryId, value: c.categoryId, label: c.name }))}
              />
            </FormItem>
            <FormItem label={'Title'} errors={errors.title?.message}>
              <HInput name={'title'} ref={register} />
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
          </>
        )}
      </HForm>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default CreateBoardPage;
