import { Handler, withIronSession } from 'next-iron-session';

export const withSession = (handler: Handler) =>
  withIronSession(handler, {
    password: '123412341234123412341234123412341234123412341234123412341234123412341234',
    cookieName: 'next-iron-session/examples/next.js',
    cookieOptions: {
      // the next line allows to use the session in non-https environements like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production'
    }
  });
