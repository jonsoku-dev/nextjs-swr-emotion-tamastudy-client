import { GetServerSideProps, NextPage } from 'next';

import { joinAction } from '../shared';
import { withSession } from '../shared/hocs';
import { useUser } from '../shared/hooks';

interface Props {}

const JoinPage: NextPage<Props> = () => {
  const { mutateUser } = useUser({
    redirectTo: '/',
    redirectIfFound: true
  });
  return (
    <button
      onClick={async () =>
        await mutateUser(
          joinAction({
            username: '1234',
            email: 'the2792@gmail.com',
            password: '1234'
          })
        )
      }>
      onClickJoin
    </button>
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

export default JoinPage;
