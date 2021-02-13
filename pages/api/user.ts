import { withSession } from '../../shared';

export default withSession(async (req, res) => {
  const initialUser = req.session.get('initialUser');

  if (initialUser) {
    res.json({
      isLoggedIn: true,
      ...initialUser
    });
  } else {
    res.json({
      isLoggedIn: false
    });
  }
});
