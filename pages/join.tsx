import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Layout from '../components/common/Layout';
import { REGISTER_ERROR_MESSAGES } from '../shared/enums';
import { IUserJoinRequestForm, useUserContext } from '../shared/hooks/useUserContext';

interface Props {}

const schema = yup.object().shape({
  username: yup
    .string()
    .max(10, REGISTER_ERROR_MESSAGES.MAX_LENGTH_USERNAME)
    .required(REGISTER_ERROR_MESSAGES.REQUIRED_USERNAME),
  email: yup.string().email(REGISTER_ERROR_MESSAGES.VALIDATE_EMAIL).required(REGISTER_ERROR_MESSAGES.REQUIRED_EMAIL),
  password: yup.string().required(REGISTER_ERROR_MESSAGES.REQUIRED_PASSWORD)
});

const JoinPage: NextPage<Props> = () => {
  const router = useRouter();
  const { isLoading, isLoggedIn, joinUser } = useUserContext();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: IUserJoinRequestForm) => joinUser(data);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="username" defaultValue="" ref={register} />
        <p>{errors.username?.message}</p>
        <input name="email" defaultValue="" ref={register} />
        <p>{errors.email?.message}</p>
        <input name="password" defaultValue="" ref={register} />
        <p>{errors.password?.message}</p>
        <input type="submit" />
      </form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default JoinPage;
