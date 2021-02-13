import { AxiosError } from 'axios';
import { GetServerSideProps, NextPage } from 'next';

import { loginAction, useAlertContext, useUser, withSession } from '../shared';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  });

  const { setError } = useAlertContext();

  const onClickLogin = () => {
    mutateUser(
      loginAction({
        email: 'the2792@gmail.com',
        password: '1234'
      })
    ).catch((error: AxiosError) => {
      setError({ message: '로그인 에러입니다.', status: error.response?.status, type: 'warn' });
    });
  };

  return (
    <div>
      <button onClick={onClickLogin}>onClickLogin</button>
    </div>
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
