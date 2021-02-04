import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Layout from '../components/common/Layout';
import { LOGIN_ERROR_MESSAGES } from '../shared/enums';
import { IUserLoginRequestForm, useUserContext } from '../shared/hooks/useUserContext';

type FormValues = {
  email: string;
  password: string;
};

interface Props {}

const schema = yup.object().shape({
  email: yup.string().email(LOGIN_ERROR_MESSAGES.VALIDATE_EMAIL).required(LOGIN_ERROR_MESSAGES.REQUIRED_EMAIL),
  password: yup.string().required(LOGIN_ERROR_MESSAGES.REQUIRED_PASSWORD)
});

const LoginPage: NextPage<Props> = () => {
  const router = useRouter();
  const { isLoading, isLoggedIn, loginUser } = useUserContext();
  const { handleSubmit, register, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<FormValues> = (data: IUserLoginRequestForm) => loginUser(data);

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

export default LoginPage;
