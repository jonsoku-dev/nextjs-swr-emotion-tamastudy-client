const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export const API_URL = {
  LOGIN: `${NEXT_PUBLIC_BASE_URL}/api/v1/user/login`,
  JOIN: `${NEXT_PUBLIC_BASE_URL}/api/v1/user/join`,
  AUTHENTICATE: `${NEXT_PUBLIC_BASE_URL}/api/v1/user/authenticate`
};

export const BOARD_URL = {
  BASE_BOARD: `${NEXT_PUBLIC_BASE_URL}/api/v1/board`,
  BASE_BOARD_IDS: `${NEXT_PUBLIC_BASE_URL}/api/v1/board/ids`,
  BASE_CATEGORY: `${NEXT_PUBLIC_BASE_URL}/api/v1/category`
};
