import type { ModuleModel } from "./ModuleModel";

export interface GetModuleModel extends ModuleModel {
  id: string;
  applicationCode: string;
  applicationName: string;
  isActive: boolean;
}
