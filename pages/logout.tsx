import { NextPage } from 'next';
import { useCallback, useEffect } from 'react';

import { logoutAction, useUser } from '../shared';

interface Props {}

const LogoutPage: NextPage<Props> = () => {
  const { user, mutateUser } = useUser({
    redirectIfFound: true,
    redirectTo: '/'
  });

  const logout = useCallback(async () => {
    await mutateUser(logoutAction());
  }, [user]);

  useEffect(() => {
    if (user.isLoggedIn) {
      alert('너 로그인중이잖아');
      logout();
    }
  }, [user, logout]);

  return <div>LogoutPage</div>;
};

export default LogoutPage;
