import { type PageParamsModel } from "./PageParamsModel";
import { type SortParamsModel } from "./SortParamsModel";

export const defaultPage: PageParamsModel = {
  page: 1,
  pageSize: 10
}

export interface SearchParamsModel<T> {
  filter: T;
  page: PageParamsModel;
  sort: SortParamsModel[];
}
