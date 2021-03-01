import { yupResolver } from '@hookform/resolvers/yup';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { HForm, HInput } from '../components/atoms';
import { Layout } from '../components/templates/Layout';
import { UserJoinRequestDto } from '../generated-sources/openapi';
import { useAuth, userJoinSchema } from '../shared';

interface Props {}

const JoinPage: NextPage<Props> = () => {
  const router = useRouter();
  const { join, isLoggedIn } = useAuth();

  const handleSubmit = useCallback(async (form: UserJoinRequestDto) => join(form).then(() => router.push('/')), []);

  return (
    <Layout isLoggedIn={isLoggedIn}>
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
    </Layout>
  );
};

export default JoinPage;
