import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { GetActionModel } from "@/features/actions/models/GetActionModel";
import type { ListActionModel } from "@/features/actions/models/ListActionModel";
import type { CreateActionModel } from "@/features/actions/models/CreateActionModel";
import type { UpdateActionModel } from "@/features/actions/models/UpdateActionModel";

const baseUrl = `${environment.backend.apiUrl}/action`;
const client = createAxiosClient(baseUrl);

export async function createAction(body: CreateActionModel): Promise<ResponseDto<GetActionModel>> {
  const { data } = await client.post<ResponseDto<GetActionModel>>("", body);
  return data;
}

export async function updateAction(body: UpdateActionModel): Promise<ResponseDto<GetActionModel>> {
  const { data } = await client.put<ResponseDto<GetActionModel>>("", body);
  return data;
}

export async function deleteAction(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getAction(id: string): Promise<ResponseDto<GetActionModel>> {
  const { data } = await client.get<ResponseDto<GetActionModel>>(`/${id}`);
  return data;
}

export async function listActions(): Promise<ResponseDto<ListActionModel[]>> {
  const { data } = await client.get<ResponseDto<ListActionModel[]>>("/list");
  return data;
}

export async function listActionsByModule(moduleId: string): Promise<ResponseDto<ListActionModel[]>> {
  const { data } = await client.get<ResponseDto<ListActionModel[]>>(`/${moduleId}/list`);
  return data;
}
