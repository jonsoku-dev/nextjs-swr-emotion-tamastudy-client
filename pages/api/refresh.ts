import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import withSession from '../../lib/session';
import { UserAuthenticateResponse, UserLoginResponse } from '../../shared/types';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const loginSession = req.session.get('login') as UserLoginResponse;
  console.log(loginSession, 'before refresh');

  if (!loginSession) {
    return res.status(403).json({
      message: 'please login first'
    });
  }

  const token = loginSession.token;
  const refreshToken = loginSession.refreshToken;

  try {
    const { data: refreshData } = await axios.post<UserAuthenticateResponse>(
      'http://localhost:8080/api/v1/user/refresh',
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'REFRESH-TOKEN': refreshToken
        }
      }
    );
    req.session.set('login', refreshData);
    await req.session.save();
    res.json(refreshData);
  } catch (error) {
    res.status(error.response?.status || 500).json(null);
  }
});
