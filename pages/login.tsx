import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { Layout } from '../components/templates/Layout';
import { LoginRequest, useAuth, userJoinSchema } from '../shared';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();

  const handleSubmit = useCallback((form: LoginRequest) => login(form), []);

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
