import * as yup from 'yup';

import { ERROR_MESSAGES } from '../enums';

export const userJoinSchema = yup.object().shape({
  email: yup.string().email(ERROR_MESSAGES.USER_EMAIL_REGEX).required(ERROR_MESSAGES.USER_EMAIL_REQUIRED),
  password: yup.string().required(ERROR_MESSAGES.USER_PASSWORD_REQUIRED)
});
