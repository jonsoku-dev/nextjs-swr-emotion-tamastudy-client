import axios from '../utils/axios';

export interface ErrorProps {
  errorCode?: string;
  errorMessage?: string;
}

interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}
interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
export interface BasePaging<T> {
  content?: T[] | null;
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  sort: Sort;
  size: number;
  number: number;
  empty: boolean;
}

export const basePostAPI = async <RequestBody, ResponseBody>(
  url: string,
  body: RequestBody
): Promise<ResponseBody | undefined> => {
  try {
    const res = await axios.post(url, body);
    return res.data as ResponseBody;
  } catch (e) {
    console.log(e);
  }
};

export const basePatchAPI = async <RequestBody, ResponseBody>(
  url: string,
  body: RequestBody
): Promise<ResponseBody | undefined> => {
  try {
    const res = await axios.patch(url, body);
    return res.data as ResponseBody;
  } catch (e) {
    console.log(e);
  }
};

export const baseDeleteAPI = async (url: string, onSuccess?: () => void, onError?: () => void): Promise<void> => {
  try {
    await axios.delete(url);
    onSuccess && onSuccess();
    return;
  } catch (e) {
    onError && onError();
  }
};
