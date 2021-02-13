import axios, { AxiosError } from 'axios';

import { JWT_TOKEN } from '../enums';
import { IS_SERVER } from './isServer';

const Axios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${IS_SERVER ? null : localStorage.getItem(JWT_TOKEN)}`
  }
});

Axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    throw error;
  }
);

export { Axios };
