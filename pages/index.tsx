import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { IUser } from '../shared/apis';
import withSession from '../shared/session';

interface Props {
  initialUser: IUser;
}

const IndexPage: NextPage<Props> = ({ initialUser }) => {
  console.log(initialUser);
  return <div>IndexPage</div>;
};

export const getServerSideProps: GetServerSideProps<Props> = withSession(async ({ req, res }) => {
  const initialUser = req.session.get('initialUser');

  console.log(initialUser, 'initialUser index');

  if (initialUser === undefined) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { initialUser }
  };
});

export default IndexPage;
