import { type PermissionModel } from "./permissionModel";

export interface RolePermissionModel {
  moduleCode: string;
  moduleName: string;
  permissions: PermissionModel[];
}
