import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Form, TextInput } from '../components/atoms';
import { Layout } from '../components/common';
import { FormItem } from '../components/molecules';
import { REGISTER_ERROR_MESSAGES } from '../shared/enums';
import { IUserJoinRequestForm, useUserContext } from '../shared/hooks';

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
  const userContext = useUserContext();
  const { register, handleSubmit, errors } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const onSubmit = (form: IUserJoinRequestForm) => {
    userContext.joinUser(
      form,
      () => {
        router.push(`/login?email=${form.email}`, 'login');
      },
      () => {
        alert('ERROR!');
      }
    );
  };

  useEffect(() => {
    if (userContext.isLoggedIn) {
      router.push('/');
    }
  }, [userContext.isLoggedIn]);

  if (userContext.isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <Layout title={'Join Page'} {...userContext}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormItem label={'Username'} errors={errors.username?.message}>
          <TextInput name={'username'} register={register} />
        </FormItem>
        <FormItem label={'Email'} errors={errors.email?.message}>
          <TextInput name={'email'} register={register} />
        </FormItem>
        <FormItem label={'Password'} errors={errors.password?.message}>
          <TextInput name={'password'} register={register} />
        </FormItem>
        <Button type="submit" text="join" />
      </Form>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default JoinPage;
