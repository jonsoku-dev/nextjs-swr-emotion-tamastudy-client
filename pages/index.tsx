import { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import Layout from '../components/Layout';
import { InitialUserProps } from './_app';

export interface IndexProps extends InitialUserProps {
  sample?: number;
}

const IndexPage: NextPage<IndexProps> = ({ initialUser }) => {
  console.log(asd);
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
