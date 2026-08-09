import type { UserModel } from "./UserModel";

export interface GetUserModel extends UserModel {
  id: string;
  isActive: boolean;
}
