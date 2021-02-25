import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import withSession from '../../lib/session';
import { UserLoginResponse } from '../../shared/types';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await axios.post<UserLoginResponse>('http://localhost:8080/api/v1/user/login', req.body);
    req.session.set('login', data);
    await req.session.save();
    res.json(data);
  } catch (error) {
    console.log(error);
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
