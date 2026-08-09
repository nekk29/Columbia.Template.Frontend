import type { ActionModel } from "./ActionModel";

export interface GetActionModel extends ActionModel {
  id: string;
  moduleCode: string;
  moduleName: string;
  isActive: boolean;
}
