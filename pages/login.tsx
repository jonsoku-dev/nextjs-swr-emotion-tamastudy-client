import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { Layout } from '../components/templates';
import { UserLoginRequestDto } from '../generated-sources/openapi';
import { useAuth, userJoinSchema } from '../shared';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();

  const handleSubmit = useCallback(async (form: UserLoginRequestDto) => {
    try {
      await login(form);
      router.push('/');
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <Layout isLoggedIn={isLoggedIn}>
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
