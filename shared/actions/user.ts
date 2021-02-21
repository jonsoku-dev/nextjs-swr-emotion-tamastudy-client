import axios from 'axios';

import { JoinRequest, LoginRequest, LoginResponse } from '../types';

export const loginAction = (form: LoginRequest) => axios.post<LoginResponse>('/api/login', form);
export const joinAction = (form: JoinRequest) => axios.post<void>('http://localhost:8080/api/v1/user/join', form);
