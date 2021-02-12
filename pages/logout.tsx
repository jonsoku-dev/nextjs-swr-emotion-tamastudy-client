import { GetServerSideProps, NextPage } from 'next';

import withSession from '../shared/session';

interface Props {}

const LogoutPage: NextPage<Props> = () => {
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
  } else {
    req.session.destroy();
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    };
  }
});

export default LogoutPage;
