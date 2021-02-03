import nookies from 'nookies';

import axios from './axios';

const fetcher = async (url: string) => {
  const cookies = nookies.get(null);
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies['jwt']}`
    }
  });
  return res.data;
};

export default fetcher;
