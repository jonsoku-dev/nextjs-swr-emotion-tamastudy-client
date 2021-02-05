import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import { Layout } from '../components/common';
import { useUserContext } from '../shared/hooks/useUserContext';

export interface IndexProps {}

const IndexPage: NextPage<IndexProps> = () => {
  const userContext = useUserContext();
  return (
    <Layout title="Home | Next.js + TypeScript Example" {...userContext}>
      <h1>Hello Next.js</h1>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  return {
    props: {}
  };
};

export default IndexPage;
