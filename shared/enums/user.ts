export const JWT_TOKEN = 'jwt';

// api url
export enum USER_URI {
  GET_USER = 'http://localhost:8080/api/v1/user/authenticate',
  JOIN_USER = 'http://localhost:8080/api/v1/user/join',
  LOGIN_USER = 'http://localhost:8080/api/v1/user/login',
  LOGOUT_USER = 'http://localhost:8080/api/v1/user/logout'
}

export enum LOGIN_ERROR_MESSAGES {
  REQUIRED_EMAIL = '이메일은 필수입니다.',
  VALIDATE_EMAIL = '이메일 양식에 맞게 다시 입력해주세요.',
  REQUIRED_PASSWORD = '비밀번호는 필수입니다.'
}

export enum REGISTER_ERROR_MESSAGES {
  REQUIRED_USERNAME = '유저명은 필수입니다.',
  MAX_LENGTH_USERNAME = '유저명은 10자 이내로 입력해주세요.',
  REQUIRED_EMAIL = '이메일은 필수입니다.',
  VALIDATE_EMAIL = '이메일 양식에 맞게 다시 입력해주세요.',
  REQUIRED_PASSWORD = '비밀번호는 필수입니다.'
}
