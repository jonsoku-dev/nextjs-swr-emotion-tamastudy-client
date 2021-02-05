import axios from '../utils/axios';

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

export const basePostAPI = async (
  url: string,
  body: any,
  onSuccess: () => void,
  onError: () => void
): Promise<void> => {
  try {
    await axios.post(url, body);
    onSuccess && onSuccess();
    return;
  } catch (e) {
    onError && onError();
  }
};

export const basePatchAPI = async (
  url: string,
  body: any,
  onSuccess: () => void,
  onError: () => void
): Promise<void> => {
  try {
    await axios.patch(url, body);
    onSuccess && onSuccess();
    return;
  } catch (e) {
    onError && onError();
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
