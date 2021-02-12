import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { UserProps } from '../../shared/apis';
import withSession from '../../shared/session';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('====== api/login');
  const loginUrl = `http://localhost:8080/api/v1/user/login`;
  const authUrl = `http://localhost:8080/api/v1/user/authenticate`;
  try {
    // we check that the user exists on GitHub and store some data in session
    const { data: loginData } = await axios.post(loginUrl, req.body);
    const token = loginData.token;
    const { data: authData } = await axios.get(authUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const initialUser: UserProps = { isLoggedIn: true, ...authData };
    req.session.set('initialUser', initialUser);
    await req.session.save();
    res.json(initialUser);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
