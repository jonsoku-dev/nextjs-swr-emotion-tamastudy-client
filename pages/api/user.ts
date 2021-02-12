import withSession from '../../shared/session';

export default withSession(async (req, res) => {
  const initialUser = req.session.get('initialUser');
  console.log('====== api/user', JSON.stringify(initialUser));

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
