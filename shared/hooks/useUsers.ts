import useSWR from 'swr';

import { getUser } from '../apis';
import { JOIN_USER, LOGIN_USER, LOGOUT_USER, TOKEN } from '../enums';
import axios from '../utils/axios';

const useFetchedUser = () => {
  const { data, error, mutate } = useSWR('getUser', getUser);

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

const useUsers = () => {
  const { user, error, isLoading, setUser } = useFetchedUser();

  if (error?.response.status === 403 || error?.response.status === 401) {
    localStorage.removeItem(TOKEN);
  }

  const setAuthorization = (token: string) => {
    localStorage.setItem(TOKEN, token);
  };

  const removeAuthorization = () => {
    localStorage.removeItem(TOKEN);
  };

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
      setAuthorization(res.data.token);
      await setUser();
    } catch (e) {
      console.log(e);
    }
  };

  const logoutUser = async () => {
    try {
      await axios.get(LOGOUT_USER);
      removeAuthorization();
      await setUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  return { user, error, isLoading, joinUser, loginUser, logoutUser };
};

export default useUsers;
