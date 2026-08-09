import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchParamsModel } from "@/models/base/query/SearchParamsModel";
import type { QueryResultsModel } from "@/models/base/query/QueryResultsModel";

import type { GetRoleModel } from "@/features/roles/models/GetRoleModel";
import type { ListRoleModel } from "@/features/roles/models/ListRoleModel";
import type { CreateRoleModel } from "@/features/roles/models/CreateRoleModel";
import type { UpdateRoleModel } from "@/features/roles/models/UpdateRoleModel";
import type { SearchRoleModel } from "@/features/roles/models/SearchRoleModel";
import type { SearchRoleFilterModel } from "@/features/roles/models/SearchRoleFilterModel";

const baseUrl = `${environment.backend.apiUrl}/role`;
const client = createAxiosClient(baseUrl);

export async function createRole(body: CreateRoleModel): Promise<ResponseDto<GetRoleModel>> {
  const { data } = await client.post<ResponseDto<GetRoleModel>>("", body);
  return data;
}

export async function updateRole(body: UpdateRoleModel): Promise<ResponseDto<GetRoleModel>> {
  const { data } = await client.put<ResponseDto<GetRoleModel>>("", body);
  return data;
}

export async function deleteRole(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getRole(id: string): Promise<ResponseDto<GetRoleModel>> {
  const { data } = await client.get<ResponseDto<GetRoleModel>>(`/${id}`);
  return data;
}

export async function listRoles(): Promise<ResponseDto<ListRoleModel[]>> {
  const { data } = await client.get<ResponseDto<ListRoleModel[]>>("/list");
  return data;
}

export async function searchRoles(body: SearchParamsModel<SearchRoleFilterModel>): Promise<ResponseDto<QueryResultsModel<SearchRoleModel>>> {
  const { data } = await client.post<ResponseDto<QueryResultsModel<SearchRoleModel>>>("/search", body);
  return data;
}
