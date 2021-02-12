import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import withSession from '../shared/session';

interface Props {}

const LoginPage: NextPage<Props> = () => {
  return <div>LoginPage</div>;
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async ({ req, res }) => {
  const initialUser = req.session.get('initialUser');

  console.log(initialUser, 'initialUser index');

  if (initialUser) {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: {}
  };
});

export default LoginPage;
