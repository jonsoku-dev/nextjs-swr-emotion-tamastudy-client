import { GetServerSideProps, NextPage } from 'next';

import { Layout } from '../components/common/Layout';
import useUser from '../shared/hooks/useUser';
import withSession from '../shared/session';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const { user, login } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  });

  return (
    <Layout isLoggedIn={user?.isLoggedIn}>
      <button
        onClick={() =>
          login({
            email: 'the2792@gmail.com',
            password: '1234'
          })
        }>
        onClickLogin
      </button>
    </Layout>
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
