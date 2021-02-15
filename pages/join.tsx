import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { joinAction, useAlertContext, UserJoinForm, userJoinSchema, withSession } from '../shared';

interface Props {}

const JoinPage: NextPage<Props> = () => {
  const router = useRouter();
  const { setError } = useAlertContext();

  const handleSubmit = useCallback((form: UserJoinForm) => {
    joinAction(form)
      .then(() => router.push(`/login?email=${form.email}`, 'login'))
      .catch((error: AxiosError) => {
        setError({ message: '회원가입 에러입니다.', status: error.response?.status, type: 'error' });
      });
  }, []);

  return (
    <HForm onSubmit={handleSubmit} resolver={yupResolver(userJoinSchema)}>
      {({ register }) => (
        <>
          <HInput placeholder={'username'} name={'username'} ref={register} />
          <HInput placeholder={'email'} name={'email'} ref={register} />
          <HInput placeholder={'password'} name={'password'} ref={register} />
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

export default JoinPage;
