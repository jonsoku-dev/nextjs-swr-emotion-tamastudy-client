import nookies from 'nookies';
import useSWR from 'swr';

import { IUser } from '../apis';
import { JOIN_USER, LOGIN_USER, LOGOUT_USER, TOKEN } from '../enums';
import axios from '../utils/axios';

const useFetchedUser = (initialUser: IUser | null) => {
  const { data, error, mutate } = useSWR('/v1/user/authenticate', {
    initialData: initialUser
  });

  const user = data;
  const isLoading = !data;
  const setUser = mutate;

  return {
    user,
    error,
    isLoading,
    setUser
  };
};

const useUsers = (initialUser: IUser | null) => {
  const { user, error, isLoading, setUser } = useFetchedUser(initialUser);

  if (error?.response.status === 403 || error?.response.status === 401) {
    localStorage.removeItem(TOKEN);
  }

  const joinUser = async () => {
    try {
      await axios.post(JOIN_USER, {
        username: 'jonsoku2',
        email: 'the2792@gmail.com',
        password: '1234'
      });
    } catch (e) {
      alert(e.response.messages);
      console.log(e);
    }
  };

  const loginUser = async () => {
    try {
      const res = await axios.post(LOGIN_USER, {
        email: 'the2792@gmail.com',
        password: '1234'
      });
      nookies.set(null, 'jwt', res.data.token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      });
      await setUser();
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(LOGOUT_USER);
      nookies.destroy(null, 'jwt');
      await setUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  return { user, error, isLoading, joinUser, loginUser, logoutUser };
};

export default useUsers;
