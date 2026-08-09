export interface QueryResultsModel<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  errorMessage: string;
}
