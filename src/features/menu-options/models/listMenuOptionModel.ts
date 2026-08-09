import { type GetMenuOptionModel } from "./getMenuOptionModel";

export interface ListMenuOptionModel extends GetMenuOptionModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[];
}
