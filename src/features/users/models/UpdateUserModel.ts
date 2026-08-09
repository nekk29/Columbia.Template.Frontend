export interface UpdateUserModel {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleIds: string[];
}
