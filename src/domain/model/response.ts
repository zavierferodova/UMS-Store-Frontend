export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  next: string | null;
  previous: string | null;
}

export interface IPaginationResponse<T> {
  meta: PaginationMeta;
  data: T[];
}
