import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { Layout } from '../components/templates/Layout';
import { loginAction, useAlertContext, userJoinSchema, UserLoginForm, useUser } from '../shared';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const router = useRouter();
  const { user, mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  });

  const { setError } = useAlertContext();

  const handleSubmit = useCallback((form: UserLoginForm) => {
    mutateUser(loginAction(form)).catch((error: AxiosError) => {
      setError({ message: '로그인 에러입니다.', status: error.response?.status, type: 'error' });
    });
  }, []);

  return (
    <Layout isLoggedIn={user.isLoggedIn}>
      <HForm onSubmit={handleSubmit} resolver={yupResolver(userJoinSchema)}>
        {({ register }) => (
          <>
            <HInput name={'email'} ref={register} defaultValue={router.query.email} />
            <HInput name={'password'} ref={register} />
            <HInput type="submit" />
          </>
        )}
      </HForm>
    </Layout>
  );
};

export default LoginPage;
