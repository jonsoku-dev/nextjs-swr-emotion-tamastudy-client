import Router from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';

import { UserProps } from '../types';

interface Props {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

const initialKey = '/api/user';

export const useUser = ({ redirectTo, redirectIfFound = false }: Props) => {
  const { data: user, mutate: mutateUser } = useSWR<UserProps>(initialKey);

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

  console.log(user, 'from useUser hook');

  return { user: user ? user : ({ isLoggedIn: false } as UserProps), mutateUser };
};
