export interface ICategory {
  categoryId: number;
  name: string;
}

export interface ICategoryCreateRequest {
  name: string;
}
export interface ICategoryUpdateRequest extends Partial<ICategoryCreateRequest> {}
