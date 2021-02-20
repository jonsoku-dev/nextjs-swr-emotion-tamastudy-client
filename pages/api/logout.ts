import { withSession } from '../../shared';

export default withSession(async (req, res) => {
  console.log('여기는 에이파이다 오바');
  await req.session.destroy();
  res.json({ isLoggedIn: false });
});
