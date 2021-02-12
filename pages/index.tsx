import { yupResolver } from '@hookform/resolvers/yup';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import * as yup from 'yup';

import { HForm, HInput, HSelect } from '../components/atoms';
import { Layout } from '../components/common';
import { FormItem } from '../components/molecules/FormItem';
import { BOARD_ERROR_MESSAGES } from '../shared/enums';
import { useUserContext } from '../shared/hooks';
import withSession from '../shared/session';

export interface IndexProps {}

const schema = yup.object().shape({
  firstName: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(200, BOARD_ERROR_MESSAGES.MAX_LENGTH_TITLE)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_TITLE),
  lastName: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(2000, BOARD_ERROR_MESSAGES.MAX_LENGTH_DESCRIPTION)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION),
  sex: yup
    .string()
    .typeError(BOARD_ERROR_MESSAGES.STRING_TYPE)
    .max(2000, BOARD_ERROR_MESSAGES.MAX_LENGTH_DESCRIPTION)
    .required(BOARD_ERROR_MESSAGES.REQUIRED_DESCRIPTION)
});

type FormValues = {
  firstName: string;
  lastName: string;
  sex: string;
};

const IndexPage: NextPage<IndexProps> = () => {
  const userContext = useUserContext();
  const onSubmit = (data: FormValues) => alert(JSON.stringify(data));
  return (
    <Layout title="Home | Next.js + TypeScript Example" {...userContext}>
      <h1>Hello Next.js</h1>

      <HForm<FormValues> onSubmit={onSubmit} resolver={yupResolver(schema)}>
        {({ register, errors }) => (
          <>
            <FormItem label={'firstName'} errors={errors.firstName?.message}>
              <HInput name="firstName" ref={register} />
            </FormItem>
            <FormItem label={'sex'} errors={errors.sex?.message}>
              <HSelect
                name="sex"
                ref={register}
                options={[
                  { id: 1, label: 'Female', value: 'female' },
                  { id: 2, label: 'Male', value: 'male' }
                ]}
              />
            </FormItem>
            <FormItem label={'lastName'} errors={errors.lastName?.message}>
              <HInput name="lastName" ref={register} />
            </FormItem>
            <HInput type="submit" />
          </>
        )}
      </HForm>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = withSession(async ({ req, res }) => {
  const user = req.session.get('user');

  console.log(user, 'user index');

  if (user === undefined) {
    // res.setHeader('location', '/login');
    // res.statusCode = 302;
    // res.end();
    return { props: {} };
  }

  return {
    props: { user: req.session.get('user') }
  };
});

export default IndexPage;
