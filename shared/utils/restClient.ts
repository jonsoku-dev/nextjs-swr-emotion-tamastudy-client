import {
  BoardApiControllerApiFactory,
  BoardCategoryApiControllerApiFactory,
  CommentApiControllerApiFactory,
  UserApiControllerApiFactory
} from '../../generated-sources/openapi';

export const boardApi = BoardApiControllerApiFactory();
export const userApi = UserApiControllerApiFactory();
export const categoryApi = BoardCategoryApiControllerApiFactory();
export const commentApi = CommentApiControllerApiFactory();
