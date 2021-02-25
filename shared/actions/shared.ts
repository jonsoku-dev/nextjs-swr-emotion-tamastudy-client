/**
 * true is expired!!
 */
export const checkTokenExpired = (token: string | null) => {
  try {
    const base64Url = token?.split('.')[1];
    const base64 = base64Url?.replace('-', '+').replace('_', '/');
    const parsed = JSON.parse(atob(base64!));
    return Date.now() > parsed.exp * 1000;
  } catch (e) {
    return true;
  }
};
