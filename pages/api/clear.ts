import { NextApiRequest, NextApiResponse } from 'next';

import withSession from '../../lib/session';

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  await req.session.destroy();
  res.json({});
});
