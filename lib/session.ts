// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession } from 'next-iron-session';

export default function withSession(handler: any) {
  console.log('withSession!!');
  return withIronSession(handler, {
    password: '13218390219382132132138asd8a0s9dsa908d',
    cookieName: 'tamastudycookie',
    cookieOptions: {
      // the next line allows to use the session in non-https environements like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === 'production'
    }
  });
}
