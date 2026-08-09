import type { RoleModel } from "./RoleModel";

export interface UpdateRoleModel extends RoleModel {
  id: string;
  isActive: boolean;
}
