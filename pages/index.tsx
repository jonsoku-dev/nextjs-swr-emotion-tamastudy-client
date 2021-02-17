import { GetServerSideProps, NextPage } from 'next';

import { Layout } from '../components/templates/Layout';
import { UserProps, useUser, withSession } from '../shared';

interface Props {
  initialUser?: UserProps;
}

const IndexPage: NextPage<Props> = ({ initialUser }) => {
  const { user } = useUser({
    initialUser
  });
  return <Layout isLoggedIn={user.isLoggedIn}>{user.token}</Layout>;
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async (ctx) => {
  const initialUser: UserProps = ctx.req.session.get('initialUser');

  if (initialUser === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    };
  }

  return {
    props: { initialUser }
  };
});

export default IndexPage;
