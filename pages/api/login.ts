import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { UserProps, withSession } from '../../shared';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const loginUrl = `http://localhost:8080/api/v1/user/login`;
  const authUrl = `http://localhost:8080/api/v1/user/authenticate`;
  try {
    // we check that the user exists on GitHub and store some data in session
    const { data: loginData } = await axios.post(loginUrl, req.body);
    const token = loginData.token;

    const { data: authData } = await axios.get(authUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const initialUser: UserProps = { isLoggedIn: true, token, ...authData };
    req.session.set('initialUser', initialUser);
    await req.session.save();
    res.json(initialUser);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
