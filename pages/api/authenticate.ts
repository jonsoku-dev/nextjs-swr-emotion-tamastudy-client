import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import withSession from '../../lib/session';
import { UserAuthenticateResponse, UserLoginResponse } from '../../shared/types';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const loginSession = req.session.get('login') as UserLoginResponse;
  console.log(loginSession, 'authenticate');

  if (!loginSession) {
    return res.status(401).json({
      message: 'please login first'
    });
  }

  const token = loginSession.token;
  try {
    const { data: userData } = await axios.get<UserAuthenticateResponse>(
      'http://localhost:8080/api/v1/user/authenticate',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    req.session.set('user', userData);
    await req.session.save();
    res.json({
      isLoggedIn: true,
      ...userData
    });
  } catch (error) {
    res.status(401).json({
      isLoggedIn: false
    });
  }
});

// eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MTQxMzg2NDEsImV4cCI6MTYxNDc0MzQ0MX0.w6UfvNQorWUl09ur05yWfIuZuvALarf_M499FwB-k6E
