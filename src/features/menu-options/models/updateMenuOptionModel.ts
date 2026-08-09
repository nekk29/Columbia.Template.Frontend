import { type MenuOptionModel } from "./menuOptionModel";

export interface UpdateMenuOptionModel extends MenuOptionModel {
  id: string;
  isActive: boolean;
}
