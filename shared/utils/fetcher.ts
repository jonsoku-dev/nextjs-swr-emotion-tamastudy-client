import axios from './axios';

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export default fetcher;
