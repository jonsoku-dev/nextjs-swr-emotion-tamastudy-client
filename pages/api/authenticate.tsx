import { NextApiRequest, NextApiResponse } from 'next';

import { JWT_TOKEN } from '../../shared/enums';
import withSession from '../../shared/session';
import fetchJson from '../../shared/utils/fetchJson';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const jwtToken = req.cookies[JWT_TOKEN];
  const url = `http://localhost:8080/api/v1/user/authenticate`;

  try {
    // we check that the user exists on GitHub and store some data in session
    const data = await fetchJson(url, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    });

    const user = { isLoggedIn: true, data };

    console.log(user, 'user');

    req.session.set('user', user);
    await req.session.save();

    res.json(user);
  } catch (error) {
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
