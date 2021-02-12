import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

import { UserProps } from '../shared/apis';
import useUser from '../shared/hooks/useUser';
import withSession from '../shared/session';

interface Props {
  initialUser: UserProps;
}

const LogoutPage: NextPage<Props> = ({ initialUser }) => {
  const { user, logout } = useUser({
    redirectTo: '/login',
    redirectIfFound: true,
    initialUser
  });

  useEffect(() => {
    if (user.isLoggedIn) {
      logout();
    }
  }, [user, logout]);

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
