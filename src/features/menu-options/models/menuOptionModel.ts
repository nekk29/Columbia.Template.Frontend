export interface MenuOptionModel {
  applicationId: string;
  actionId: string;
  parentMenuOptionId: string;
  code: string;
  name: string;
  description: string;
  menuUri: string;
  menuIcon: string;
  sortOrder: number;
  children: MenuOptionModel[]
}
