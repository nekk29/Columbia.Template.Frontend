import type { ApplicationModel } from "./ApplicationModel";

export interface UpdateApplicationModel extends ApplicationModel {
  id: string;
  isActive: boolean;
}
