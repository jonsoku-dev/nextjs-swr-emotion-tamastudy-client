import { NextPage } from 'next';

import { Layout } from '../components/templates/Layout';
import { useAuth } from '../shared/hooks/useAuth';

interface Props {}

const IndexPage: NextPage<Props> = () => {
  const { auth, isLoggedIn, login, logout } = useAuth();

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <button
        onClick={() =>
          login({
            email: 'test@gmail.com',
            password: '1234'
          })
        }>
        login
      </button>
      <button onClick={() => logout()}>logout</button>
      auth: ${JSON.stringify(auth)}
    </Layout>
  );
};

export default IndexPage;
