import { type MenuOptionModel } from "./menuOptionModel";

export interface GetMenuOptionModel extends MenuOptionModel {
  id: string;
  applicationCode: string;
  applicationName: string;
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  actionCode: string;
  actionName: string;
  parentCode: string;
  parentName: string;
  isActive: boolean;
}
