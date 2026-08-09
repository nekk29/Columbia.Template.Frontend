import type { GetModuleModel } from "./GetModuleModel";
import type { GetActionModel } from "@/features/actions/models/GetActionModel";

export interface ListModuleModel extends GetModuleModel {
  actions: GetActionModel[];
}
