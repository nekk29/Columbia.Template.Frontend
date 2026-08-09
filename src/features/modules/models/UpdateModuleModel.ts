import type { ModuleModel } from "./ModuleModel";

export interface UpdateModuleModel extends ModuleModel {
  id: string;
  isActive: boolean;
}
