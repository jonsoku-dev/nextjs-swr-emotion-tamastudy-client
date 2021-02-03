import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '../../components/Layout';
import { getAsString } from '../../shared/utils/getAsString';

const BoardPage = () => {
  const { query } = useRouter();

  // const boardId = getAsString(query.id || '');

  return (
    <Layout title="About | Next.js + TypeScript Example">
      <h1>About</h1>
      <p>This is the about page</p>
      <p>
        <Link href="/board">
          <a>Go to Board</a>
        </Link>
      </p>
    </Layout>
  );
};

export default BoardPage;
