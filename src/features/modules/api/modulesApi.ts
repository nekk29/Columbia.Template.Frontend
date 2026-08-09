import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { GetModuleModel } from "@/features/modules/models/GetModuleModel";
import type { ListModuleModel } from "@/features/modules/models/ListModuleModel";
import type { CreateModuleModel } from "@/features/modules/models/CreateModuleModel";
import type { UpdateModuleModel } from "@/features/modules/models/UpdateModuleModel";
import type { SearchModuleModel } from "@/features/modules/models/SearchModuleModel";
import type { SearchModuleFilterModel } from "@/features/modules/models/SearchModuleFilterModel";

const baseUrl = `${environment.backend.apiUrl}/module`;
const client = createAxiosClient(baseUrl);

export async function createModule(body: CreateModuleModel): Promise<ResponseDto<GetModuleModel>> {
  const { data } = await client.post<ResponseDto<GetModuleModel>>("", body);
  return data;
}

export async function updateModule(body: UpdateModuleModel): Promise<ResponseDto<GetModuleModel>> {
  const { data } = await client.put<ResponseDto<GetModuleModel>>("", body);
  return data;
}

export async function deleteModule(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getModule(id: string): Promise<ResponseDto<GetModuleModel>> {
  const { data } = await client.get<ResponseDto<GetModuleModel>>(`/${id}`);
  return data;
}

export async function listModules(): Promise<ResponseDto<ListModuleModel[]>> {
  const { data } = await client.get<ResponseDto<ListModuleModel[]>>("/list");
  return data;
}

export async function listModulesByApplication(applicationId: string): Promise<ResponseDto<ListModuleModel[]>> {
  const { data } = await client.get<ResponseDto<ListModuleModel[]>>(`/${applicationId}/list`);
  return data;
}

export async function listSimpleModulesByApplication(applicationId: string): Promise<ResponseDto<ListModuleModel[]>> {
  const { data } = await client.get<ResponseDto<ListModuleModel[]>>(`/${applicationId}/list-simple`);
  return data;
}

export async function searchModules(body: SearchParamsModel<SearchModuleFilterModel> | null): Promise<ResponseDto<QueryResultsModel<SearchModuleModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchModuleModel>>>("/search", body);
  return data;
}
