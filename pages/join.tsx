import { GetServerSideProps, NextPage } from 'next';

interface Props {}

const JoinPage: NextPage<Props> = () => {
  return <div>JoinPage</div>;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {}
  };
};

export default JoinPage;
