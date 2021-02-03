import axios from 'axios';

axios.interceptors.request.use((config) => {
  console.log('request interceptor!');
  return config;
});

axios.interceptors.response.use((config) => {
  console.log('response interceptor!');
  return config;
});

export default axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true
});
