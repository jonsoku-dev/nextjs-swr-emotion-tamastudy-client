import * as yup from 'yup';

export enum ERROR_MESSAGES {
  STRING = '문자로 입력해주세요.',
  NUMBER = '숫자로 입력해주세요.',
  USER_EMAIL_REQUIRED = '이메일은 필수입니다.',
  USER_USERNAME_REQUIRED = '이메일은 필수입니다.',
  USER_PASSWORD_REQUIRED = '이메일은 필수입니다.',
  USER_EMAIL_REGEX = '이메일형식이 아닙니다.',
  BOARD_TITLE_REQUIRED = '타이틀은 필수입니다.',
  BOARD_TITLE_MAX = '200자 이내로 입력해주세요.',
  BOARD_DESCRIPTION_REQUIRED = '본문은 필수입니다.',
  BOARD_DESCRIPTION_MAX = '2000자 이내로 입력해주세요.',
  BOARD_CATEGORY_REQUIRED = '카테고리는 필수입니다.',
  COMMENT_TEXT_MAX = '200자 이내로 입력해주세요.',
  COMMENT_TEXT_REQUIRED = '내용은 필수입니다.'
}

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
