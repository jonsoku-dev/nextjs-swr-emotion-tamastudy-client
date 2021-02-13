import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { logoutAction, UserProps, useUser, withSession } from '../shared';

interface Props {
  initialUser: UserProps;
}

const LogoutPage: NextPage<Props> = ({ initialUser }) => {
  const { user, mutateUser } = useUser({
    redirectTo: '/login',
    redirectIfFound: true,
    initialUser
  });

  useEffect(() => {
    const logout = async () => {
      await mutateUser(logoutAction());
    };
    if (user.isLoggedIn) {
      logout();
    }
  }, [user, logoutAction]);

  return <div>LogoutPage</div>;
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async ({ req }) => {
  const initialUser = req.session.get('initialUser');

  if (initialUser === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    };
  }

  return {
    props: {
      initialUser
    }
  };
});

export default LogoutPage;
