import type { ApplicationModel } from "./ApplicationModel";

export interface GetApplicationModel extends ApplicationModel {
  id: string;
  isActive: boolean;
}
