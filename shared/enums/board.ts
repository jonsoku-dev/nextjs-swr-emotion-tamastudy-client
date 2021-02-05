// api uri
export enum BOARD_URI {
  BASE = 'http://localhost:8080/api/v1/board'
}

export enum BOARD_ERROR_MESSAGES {
  STRING_TYPE = '문자를 입력해주세요.',
  NUMBER_TYPE = '숫자를 입력해주세요.',
  REQUIRED_TITLE = '제목을 입력해주세요.',
  MAX_LENGTH_TITLE = '제목은 200자 이내로 입력해주세요.',
  REQUIRED_DESCRIPTION = '본문을 입력해주세요.',
  MAX_LENGTH_DESCRIPTION = '본문은 2000자 이내로 입력해주세요.',
  REQUIRED_CATEGORY_ID = '카테고리 아이디는 필수 입니다.'
}
