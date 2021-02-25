import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import withSession from '../../lib/session';
import { UserLoginResponse } from '../../shared/types';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const loginSession = req.session.get('login') as UserLoginResponse;
  console.log(loginSession);
  if (!loginSession) {
    return res.status(401).json({
      message: 'please login first'
    });
  }
  try {
    await axios.post(
      'http://localhost:8080/api/v1/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${loginSession.token}`
        }
      }
    );
    await req.session.destroy();
    res.json({});
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
