import Router from 'next/router';
import { useCallback, useEffect } from 'react';
import useSWR from 'swr';

import { UserProps } from '../apis';
import fetchJson from '../utils/fetchJson';

interface Props {
  redirectTo?: string;
  redirectIfFound?: boolean;
  initialUser?: UserProps;
}

const useUser = ({ redirectTo, redirectIfFound = false, initialUser }: Props) => {
  const { data: user, mutate: mutateUser } = useSWR('/api/user', {
    initialData: initialUser
  });

  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !user) return;

    if (
      // If redirectTo is set, redirect if the user was not found.
      (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
      // If redirectIfFound is also set, redirect if the user was found
      (redirectIfFound && user?.isLoggedIn)
    ) {
      Router.push(redirectTo);
    }
  }, [user, redirectIfFound, redirectTo]);

  const login = useCallback(async (form: { email: string; password: string }) => {
    await mutateUser(
      fetchJson('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    );
  }, []);

  const logout = useCallback(async () => {
    await mutateUser(
      fetchJson('/api/logout', {
        method: 'POST'
      })
    );
  }, []);

  return { user: user ? user : ({ isLoggedIn: false } as UserProps), login, logout };
};

export default useUser;
