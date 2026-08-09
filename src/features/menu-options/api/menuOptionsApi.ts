import { environment } from "@/environments/environment";
import { createAxiosClient } from "@/core/api/apiClient";

import type { ResponseDto } from "@/models/base/api/ResponseDto";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";

import type { GetMenuOptionModel } from "@/features/menu-options/models/getMenuOptionModel";
import type { CreateMenuOptionModel } from "@/features/menu-options/models/createMenuOptionModel";
import type { UpdateMenuOptionModel } from "@/features/menu-options/models/updateMenuOptionModel";

const baseUrl = `${environment.backend.apiUrl}/menu-option`;
const client = createAxiosClient(baseUrl);

export async function createMenuOption(body: CreateMenuOptionModel): Promise<ResponseDto<GetMenuOptionModel>> {
  const { data } = await client.post<ResponseDto<GetMenuOptionModel>>(``, body);
  return data;
}

export async function updateMenuOption(body: UpdateMenuOptionModel): Promise<ResponseDto<GetMenuOptionModel>> {
  const { data } = await client.put<ResponseDto<GetMenuOptionModel>>(``, body);
  return data;
}

export async function deleteMenuOption(id: string): Promise<ResponseBaseDto> {
  const { data } = await client.delete<ResponseBaseDto>(`/${id}`);
  return data;
}

export async function getMenuOption(id: string): Promise<ResponseDto<GetMenuOptionModel>> {
  const { data } = await client.get<ResponseDto<GetMenuOptionModel>>(`/${id}`);
  return data;
}

export async function listMenuOptions(applicationCode: string): Promise<ResponseDto<GetMenuOptionModel[]>> {
  const { data } = await client.get<ResponseDto<GetMenuOptionModel[]>>(`/${applicationCode}/list`);
  return data;
}

export async function listAllMenuOptions(applicationCode: string): Promise<ResponseDto<GetMenuOptionModel[]>> {
  const { data } = await client.get<ResponseDto<GetMenuOptionModel[]>>(`/${applicationCode}/list-all`);
  return data;
}

export async function listTreeMenuOptions(applicationCode: string): Promise<ResponseDto<GetMenuOptionModel[]>> {
  const { data } = await client.get<ResponseDto<GetMenuOptionModel[]>>(`/${applicationCode}/tree`);
  return data;
}

export async function listTreeAllMenuOptions(applicationCode: string): Promise<ResponseDto<GetMenuOptionModel[]>> {
  const { data } = await client.get<ResponseDto<GetMenuOptionModel[]>>(`/${applicationCode}/tree-all`);
  return data;
}
