import { GetServerSideProps, NextPage } from 'next';

import { Layout } from '../components/common/Layout';
import { UserProps } from '../shared/apis';
import useUser from '../shared/hooks/useUser';
import withSession from '../shared/session';

interface Props {
  initialUser: UserProps;
}

const IndexPage: NextPage<Props> = ({ initialUser }) => {
  const { user } = useUser({
    initialUser
  });
  return <Layout isLoggedIn={user?.isLoggedIn}>IndexPage</Layout>;
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
    props: { initialUser }
  };
});

export default IndexPage;
