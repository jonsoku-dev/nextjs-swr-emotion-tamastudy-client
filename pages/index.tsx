import { NextPage } from 'next';

import { Layout } from '../components/templates/Layout';
import { boardApi, useAuth, userApi } from '../shared';

interface Props {}

const IndexPage: NextPage<Props> = () => {
  const { isLoggedIn, login, logout } = useAuth();

  const handleSubmit = async () => {
    try {
      const res = await boardApi.createBoard({
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
      const res = await userApi.refreshToken('', '');
      alert(JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBoards = async () => {
    const { data } = await boardApi.getBoardsV1(
      {
        keyword: '',
        categoryName: ''
      },
      {}
    );
    console.log(data);
  };

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <button onClick={handleGetBoards}>getBoards</button>
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
    </Layout>
  );
};

export default IndexPage;
