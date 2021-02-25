import axios from 'axios';
import { NextPage } from 'next';

import { Layout } from '../components/templates/Layout';
import { createBoardAction, useAuth } from '../shared';

interface Props {}

const IndexPage: NextPage<Props> = () => {
  const { auth, isLoggedIn, login, logout } = useAuth();

  const handleSubmit = async () => {
    try {
      const res = await createBoardAction({
        title: '213',
        categoryId: 1,
        description: '213213213'
      });
      alert(JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/v1/user/refresh');
      alert(JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <button
        onClick={() =>
          login({
            email: 'test@gmail.com',
            password: '1234'
          })
        }>
        login (일반)
      </button>
      <button onClick={logout}>logout</button>
      <button onClick={handleSubmit}>handleSubmit</button>
      <button onClick={handleRefresh}>handleRefresh</button>
      auth: ${JSON.stringify(auth)}
    </Layout>
  );
};

export default IndexPage;
