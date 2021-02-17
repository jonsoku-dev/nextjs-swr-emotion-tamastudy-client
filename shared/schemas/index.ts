import * as yup from 'yup';

import { ERROR_MESSAGES } from '../enums';

export const userJoinSchema = yup.object().shape({
  email: yup.string().email(ERROR_MESSAGES.USER_EMAIL_REGEX).required(ERROR_MESSAGES.USER_EMAIL_REQUIRED),
  password: yup.string().required(ERROR_MESSAGES.USER_PASSWORD_REQUIRED)
});

export const createBoardSchema = yup.object().shape({
  title: yup
    .string()
    .typeError(ERROR_MESSAGES.STRING)
    .max(200, ERROR_MESSAGES.BOARD_TITLE_MAX)
    .required(ERROR_MESSAGES.BOARD_TITLE_REQUIRED),
  description: yup
    .string()
    .typeError(ERROR_MESSAGES.STRING)
    .max(200000, ERROR_MESSAGES.BOARD_DESCRIPTION_MAX)
    .test('validate-description', ERROR_MESSAGES.BOARD_DESCRIPTION_REQUIRED, (value) => value !== '<p><br></p>')
    .required(ERROR_MESSAGES.BOARD_DESCRIPTION_REQUIRED),
  categoryId: yup.number().typeError(ERROR_MESSAGES.NUMBER).required(ERROR_MESSAGES.BOARD_CATEGORY_REQUIRED)
});

export const commentSchema = yup.object().shape({
  text: yup
    .string()
    .typeError(ERROR_MESSAGES.STRING)
    .max(200, ERROR_MESSAGES.COMMENT_TEXT_MAX)
    .required(ERROR_MESSAGES.COMMENT_TEXT_REQUIRED)
});
