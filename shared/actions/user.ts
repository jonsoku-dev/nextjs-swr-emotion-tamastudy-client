import axios from 'axios';

export const loginAction = async (form: any): Promise<any> => await axios.post('/api/login', form);
export const logoutAction = async (): Promise<any> => {
  const res = await axios.post('/api/logout');
  return res.data;
};
export const joinAction = async (form: any): Promise<any> =>
  await axios.post('http://localhost:8080/api/v1/user/join', form);
