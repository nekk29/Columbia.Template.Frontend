export interface CreateUserModel {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  roleIds: string[];
}
