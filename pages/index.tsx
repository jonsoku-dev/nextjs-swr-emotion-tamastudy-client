import { GetServerSideProps } from 'next';
import React from 'react';

import Layout from '../components/Layout';

export interface IndexProps {
  sample?: number;
}

const IndexPage = ({ sample }: IndexProps) => {
  console.log(sample);
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
