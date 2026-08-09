import type { SettingModel } from "./SettingModel";

export interface UpdateSettingModel extends SettingModel {
  isActive: boolean;
}
