import axios from 'axios';
import nookies from 'nookies';

import { JWT_TOKEN } from '../enums';

export default axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${nookies.get(null)[JWT_TOKEN]}`
  }
});
