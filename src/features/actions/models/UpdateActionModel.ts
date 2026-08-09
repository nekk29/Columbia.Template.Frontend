import type { ActionModel } from "./ActionModel";

export interface UpdateActionModel extends ActionModel {
  id: string;
  isActive: boolean;
}
