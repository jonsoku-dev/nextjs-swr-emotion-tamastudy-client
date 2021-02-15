import axios, { AxiosError } from 'axios';

import { JWT_TOKEN } from '../enums';
import { IS_SERVER } from './isServer';

const Axios = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Authorization: IS_SERVER ? 'x' : localStorage.getItem(JWT_TOKEN) ? `Bearer ${localStorage.getItem(JWT_TOKEN)}` : 'x'
  }
});

Axios.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    throw error;
  }
);

export { Axios };
