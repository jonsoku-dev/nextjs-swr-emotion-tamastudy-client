import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller } from 'react-hook-form';

import { HForm, HInput, HSelect } from '../../components/atoms';
import { FormItem } from '../../components/molecules';
import { Layout } from '../../components/templates/Layout';
import { BOARD_URL, CategoryProps, createBoardAction, CreateBoardForm, createBoardSchema, useUser } from '../../shared';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {
  initialCategories?: CategoryProps[];
}

export const getStaticProps: GetStaticProps = async () => {
  let initialCategories = null;

  await Promise.allSettled([axios.get(`${BOARD_URL.BASE_CATEGORY}`)]).then(
    axios.spread((...response) => {
      initialCategories = response[0].status === 'fulfilled' ? response[0].value.data : null;
    })
  );

  return {
    props: {
      initialCategories
    }
  };
};

const CreateBoardPage: NextPage<Props> = ({ initialCategories }) => {
  const router = useRouter();
  const { user } = useUser({
    redirectIfFound: false,
    redirectTo: '/board'
  });

  const handleSubmit = (form: CreateBoardForm) => {
    createBoardAction(form)
      .then(() => {
        router.push('/board');
      })
      .catch((e) => console.log(e.response));
  };

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
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
