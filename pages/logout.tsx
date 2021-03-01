import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Layout } from '../components/templates/Layout';
import { useAuth } from '../shared';

interface Props {}

const LogoutPage: NextPage<Props> = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      logout().then(() => router.back());
    }
  }, [isLoggedIn, logout]);

  return <Layout isLoggedIn={isLoggedIn}>LogoutPage</Layout>;
};

export default LogoutPage;
