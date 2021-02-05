import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, TextInput } from '../components/atoms';
import { Layout } from '../components/common';
import { FormItem } from '../components/molecules';
import { LOGIN_ERROR_MESSAGES } from '../shared/enums';
import { IUserLoginRequestForm, useUserContext } from '../shared/hooks';
import { getAsString } from '../shared/utils/getAsString';

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
  const userContext = useUserContext();
  const { handleSubmit, register, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const onSubmit: SubmitHandler<FormValues> = (data: IUserLoginRequestForm) => userContext.loginUser(data);

  useEffect(() => {
    if (userContext.isLoggedIn) {
      router.push('/');
    }
  }, [userContext.isLoggedIn]);

  return (
    <Layout title={'Login Page'} {...userContext}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormItem label={'Email'} errors={errors.email?.message}>
          <TextInput name={'email'} register={register} defaultValue={getAsString(router.query.email || '')} />
        </FormItem>
        <FormItem label={'Password'} errors={errors.password?.message}>
          <TextInput name={'password'} register={register} />
        </FormItem>
        <Button type="submit" text="login" disabled={userContext.isLoading} />
      </Form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default LoginPage;
