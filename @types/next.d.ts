import { IncomingMessage } from 'http';
import { Session } from 'next-iron-session';
declare module 'next' {
  export interface NextApiRequest extends IncomingMessage {
    session: Session;
  }
  export interface NextApiResponse extends IncomingMessage {
    session: Session;
  }
}
