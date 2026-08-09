import type { RoleModel } from "./RoleModel";

export interface GetRoleModel extends RoleModel {
  id: string;
  applicationCode: string;
  applicationName: string;
  isActive: boolean;
}
