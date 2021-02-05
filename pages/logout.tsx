import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { Layout } from '../components/common/Layout';
import { useUserContext } from '../shared/hooks';

interface Props {}

const LogoutPage: NextPage<Props> = () => {
  const userContext = useUserContext();
  const { isLoggedIn, isLoading, logoutUser } = userContext;
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      logoutUser(() => {
        router.push('/');
      });
    } else {
      router.push('/');
    }
  }, [isLoggedIn]);

  return (
    <Layout title={'logout page...'} {...userContext}>
      {isLoading && <span>Loading...</span>}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default LogoutPage;
