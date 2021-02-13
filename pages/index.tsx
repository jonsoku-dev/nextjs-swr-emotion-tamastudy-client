import { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import { Layout } from '../components/common/Layout';
import { UserProps } from '../shared/apis';
import { JWT_TOKEN } from '../shared/enums';
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

  nookies.set(ctx, JWT_TOKEN, initialUser.token || '');

  return {
    props: { initialUser }
  };
});

export default IndexPage;
