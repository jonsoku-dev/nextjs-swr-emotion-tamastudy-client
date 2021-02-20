import 'react-quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller } from 'react-hook-form';

import { HForm, HInput, HSelect } from '../../../components/atoms';
import { FormItem } from '../../../components/molecules';
import { Layout } from '../../../components/templates/Layout';
import {
  BOARD_URL,
  BoardProps,
  CategoryProps,
  CreateBoardForm,
  createBoardSchema,
  editBoardAction,
  useUser,
  withSession
} from '../../../shared';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false
});

interface Props {
  initialBoard?: BoardProps;
  initialCategories?: CategoryProps[];
}

const CreateBoardPage: NextPage<Props> = ({ initialBoard, initialCategories }) => {
  const { user } = useUser({
    redirectTo: '/board',
    redirectIfFound: false
  });
  const router = useRouter();

  const handleSubmit = (form: CreateBoardForm) => {
    editBoardAction(Number(router.query.id), form)
      .then(() => router.push(`/board/${router.query.id}`))
      .catch((e) => console.log(e.response));
  };

  if (!initialCategories) return null;
  if (!initialBoard) return null;

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
      <HForm onSubmit={handleSubmit} resolver={yupResolver(createBoardSchema)}>
        {({ register, control, errors }) => (
          <>
            <FormItem label={'Category'} errors={errors?.categoryId?.message}>
              <HSelect
                defaultValue={initialBoard?.categoryId}
                ref={register}
                name={'categoryId'}
                options={initialCategories.map((ca) => ({ id: ca.categoryId, label: ca.name, value: ca.categoryId }))}
              />
            </FormItem>
            <FormItem label={'Title'} errors={errors?.title?.message}>
              <HInput ref={register} name={'title'} defaultValue={initialBoard?.title} />
            </FormItem>
            <FormItem label={'Description'} errors={errors?.description?.message}>
              <Controller
                control={control}
                name="description"
                defaultValue={initialBoard?.description}
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

export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
  const initialUser = ctx.req.session.get('initialUser') || null;

  if (!initialUser) {
    return {
      redirect: {
        permanent: false,
        destination: `/board/${ctx.query.id}`
      }
    };
  }

  let initialBoard: BoardProps | null = null;
  let initialCategories: CategoryProps | null = null;

  await Promise.allSettled([
    axios.get(`${BOARD_URL.BASE_BOARD}/${ctx.query.id}`),
    axios.get(`${BOARD_URL.BASE_CATEGORY}`)
  ]).then(
    axios.spread((...response) => {
      initialBoard = response[0].status === 'fulfilled' ? response[0].value.data : null;
      initialCategories = response[1].status === 'fulfilled' ? response[1].value.data : null;
      if (initialBoard?.userId !== initialUser.userId) {
        // 작성자가 아닐 때
        return {
          redirect: {
            permanent: false,
            destination: '/board'
          }
        };
      }
    })
  );

  return {
    props: {
      initialUser,
      initialBoard,
      initialCategories
    }
  };
});

export default CreateBoardPage;
