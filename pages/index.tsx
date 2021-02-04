import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import Layout from '../components/common/Layout';

export interface IndexProps {}

const IndexPage: NextPage<IndexProps> = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
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
