import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { loginAction, useAlertContext, userJoinSchema, UserLoginForm, useUser, withSession } from '../shared';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const router = useRouter();
  const { mutateUser } = useUser({
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
    <HForm onSubmit={handleSubmit} resolver={yupResolver(userJoinSchema)}>
      {({ register }) => (
        <>
          <HInput name={'email'} ref={register} defaultValue={router.query.email} />
          <HInput name={'password'} ref={register} />
          <HInput type="submit" />
        </>
      )}
    </HForm>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async ({ req }) => {
  const initialUser = req.session.get('initialUser');

  if (initialUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }

  return {
    props: {}
  };
});

export default LoginPage;
