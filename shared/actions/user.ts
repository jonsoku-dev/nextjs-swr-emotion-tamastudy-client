import { Axios } from '../utils';

export const loginAction = async (form: any): Promise<any> => await Axios.post('/api/login', form);
export const logoutAction = async (): Promise<any> => await Axios.post('/api/logout');
export const joinAction = async (form: any): Promise<any> =>
  await Axios.post('http://localhost:8080/api/v1/user/join', form);
