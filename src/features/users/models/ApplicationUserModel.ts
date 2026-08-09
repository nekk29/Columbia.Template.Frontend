import type { ApplicationUserRoleModel } from "./ApplicationUserRoleModel";

export interface ApplicationUserModel {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  roleId: string;
  id: string;
  role: ApplicationUserRoleModel;
}
